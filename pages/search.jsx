import { StyleSheet, View, Text } from 'react-native';
import React from 'react';



const Search = ({ navigation }) => {

  return (

    <View style={styles.container}>
        <Text>Search</Text>
    </View>
  );
}

export { Search }

const styles = StyleSheet.create({
  container: {
    alignItems:"center",
    justifyContent:"center",
    flex:1
  },
});