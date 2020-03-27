import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from 'react-native-paper'

const ErrorMessage = ({ errorValue }) => (
  <View style={styles.container}>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginLeft: 25,
    marginVertical: 10
  },
  errorText: {
    color: "red"
  }
});

export default ErrorMessage;
