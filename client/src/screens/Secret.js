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

var crypt = new Crypt();
var rsa = new RSA();

export default class Secret extends Component {
  state = {
    message: 'Loading..',
    loading: false,
    privateKey: '',
    showKey: '',
  }

  onInputChange = (key, value) => {
    // saves input field to state
    this.setState(prevState => ({
      ...prevState,
      [key]: value
    }))
  }

  storeItem = async (key, store) => {
    // stores item into local storage, objects must be converted to JSON string
    try {
      const item = await AsyncStorage.setItem(key, store);
      return item;
    } catch (err) {
      console.log(err.message)
    }
  };

  retrieveItem = async (key) => {
    // retrieves item from local storage
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
    rsa.generateKeypair(async (keypair) => {

      // shards private key
      var clientKey = this.state.privateKey.slice(0, 25);
      var serverKey = this.state.privateKey.slice(25,50);

      // captures generated encryption key pairing for server key encryption
      var encryptionPublicKey = await keypair.publicKey;
      var encryptionPrivateKey = await keypair.privateKey;

      // encrypts server shard for server storage
      var encrypted = await crypt.encrypt(encryptionPublicKey, serverKey);

      // stores server encryption keypairing in client localstorage
      var stored = await this.storeItem("name" + "EncryptionKeys", JSON.stringify({
        encryptionPublicKey: encryptionPublicKey,
        encryptionPrivateKey: encryptionPrivateKey
      }));

      console.log(stored);

      // sends keys to server for client key encryption and server key storage
      try {
        const jwt = await this.retrieveItem("JWT_TOKEN");
        const res = await fetch(`${config.API_ADDR}/api/private-key-encryption`, {
          method: "POST",
          body: JSON.stringify({
            serverKey: encrypted,
            clientKey: clientKey
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwt
          }
        });

        // retrieve server resonse
        const json = await res.json();
        console.log(json);
        const status = await res.status;
        switch (status) {
          case 200:

            // store encrypted client key
            await this.storeItem("name", json.clientKey);
            console.log('success');
            break;
          default:
            const error = new Error(res.error);
            throw error;
        };
      } catch (err) {
        console.log('Promise is rejected with error: ' + err);
      }
    });
  }

  combineKey = async () => {

    // get encrypted client key from local storage
    const clientKey = await this.retrieveItem("name");

    try {

      // send client key to server for decryption
      const jwt = await this.retrieveItem("JWT_TOKEN");
      const res = await fetch(`${config.API_ADDR}/api/private-key-decryption`, {
        method: "POST",
        body: JSON.stringify(clientKey),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwt
        }
      });

      // retrieve server resonse
      const json = await res.json();
      console.log(json);
      const status = await res.status;
      switch (status) {
        case 200:
          console.log(json.clientKey);
          const keygen = await this.retrieveItem("name" + "EncryptionKeys");
          const decrypted = await crypt.decrypt(keygen.encryptionPrivateKey, json.serverKey);
          
          console.log(decrypted)
          this.setState({
            showKey: json.clientKey + decrypted.message
          })
          break;
        default:
          const error = new Error(res.error);
          throw error;
      };
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
          placeholder="EOS Dummy Private Key"
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
        <Button
          onPress = { this.combineKey }
          title='Show Key'
        />
        <Text>{ this.state.showKey }</Text>
      </View>
    );
  }
}
