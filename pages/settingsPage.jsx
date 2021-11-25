import { StyleSheet, View, Text } from 'react-native';
import Colors from '../src/style';
import React, { useState } from 'react';


const SettingsPage = ({ navigation }) => {


  return (


    <View style={styles.container}>
      <Text style={{ color: Colors.textColor }}>Settings</Text>
    </View>
  );
}

export { SettingsPage }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
});

