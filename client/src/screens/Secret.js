import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage
} from 'react-native';
import config from '../config';
import { Button, Input } from '../components';
import { Link } from '../navigation';
import { Crypt, keyManager, RSA } from 'hybrid-crypto-js';

export default class Secret extends Component {
  state = {
    message: 'Loading..',
    loading: false,
    privateKey: ''
  }

  onInputChange = (key, value) => {
    this.setState(prevState => ({
      ...prevState,
      [key]: value
    }))
  }

  storeItem = async (key, store) => {
    try {
      const item = await AsyncStorage.setItem(key, store);
      return item;
    } catch (err) {
      console.log(err.message)
    }
  };

  retrieveItem = async (key) => {
    try {
      const retrievedItem =  await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return
  }

  distriubteKey = async () => {
    var key1 = this.state.privateKey.slice(0, 25);
    var key2 = this.state.privateKey.slice(25,50);
    console.log(this.state.privateKey, key1, key2);
    var stored = await this.storeItem("privateKey", key1);
    console.log(stored);
    try {
      const jwt = await this.retrieveItem("JWT_TOKEN");
      const res = await fetch(`${config.API_ADDR}/api/store-private-key`, {
        method: "POST",
        body: JSON.stringify({
          privateKey: key2
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt
        }
      });
      const json = await res.json();
      const status = await res.status;
      await json;
    } catch (err) {
      console.log('Promise is rejected with error: ' + err);
    }
  }

  async componentDidMount() {
    try {
      const jwt = await this.retrieveItem("JWT_TOKEN");
      const res = await fetch(`${config.API_ADDR}/api/secret`, {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + jwt
        }
      });
      if (res) {
        const api = await res.text()
        this.setState({ message:  api})
      }
    } catch (err) {
      console.log('Promise is rejected with error: ' + err);
    }
  }

  render() {
    console.log(this.state);
    return (
      <View>
        <Link to='/u/settings'>
          <Button
            isLoading = {this.state.loading}
            title='User Settings'
          />
        </Link>
        <Text style={{fontWeight:'bolder', fontSize: 20}}>Authenticated Page</Text>
        <Text>{this.state.message}</Text>
        <Input
          placeholder="Private Key"
          type='privateKey'
          name='privateKey'
          onChangeText={this.onInputChange}
          value={this.state.privateKey}
          secureTextEntry
        />
        <Button
          onPress = { this.distriubteKey }
          title='Save Key'
        />
      </View>
    );
  }
}
