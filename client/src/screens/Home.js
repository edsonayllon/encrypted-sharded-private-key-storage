import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';
import config from '../config';

export default class Home extends Component {
  state = {
    message: 'Loading..'
  }

  componentDidMount() {
    fetch(`${config.API_ADDR}/api/home`)
      .then(res => res.text())
      .then(api => {
        this.setState({ message:  api})
      });
  }

  render() {
    return (
      <View>
        <Text>Home</Text>
        <Text>{this.state.message}</Text>
      </View>
    );
  }
}
