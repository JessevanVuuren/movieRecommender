import { StyleSheet, View, Text } from 'react-native';
import React from 'react';



const Settings = ({ navigation }) => {

  return (

    <View style={styles.container}>
        <Text>Settings</Text>
    </View>
  );
}

export { Settings }

const styles = StyleSheet.create({
  container: {
    alignItems:"center",
    justifyContent:"center",
    flex:1
  },
});