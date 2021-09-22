import { StyleSheet, View, Button } from 'react-native';
import Colors from '../src/style';
import React, { useEffect, useState } from 'react';

import WatchList from '../components/watchList';
import {removeFullList} from "../src/saveLoadWatchList"

const watchList = ({ route, navigation }) => {

  const [newNumber, setNewNumber] = useState(1)

  React.useEffect(() => {
    setNewNumber(Math.random)
    const willFocusSubscription = navigation.addListener('focus', () => {
      setNewNumber(Math.random)
    });

    return willFocusSubscription;
  }, []);

  


  return (
    <View style={styles.container}>
      <Button title={"dell list"} onPress={() => { removeFullList() }}></Button>
      <WatchList key={Math.random() * newNumber} navigation={navigation} />
    </View>
  );
}

export { watchList }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    width: "100%",
    flex: 1,
  },
});
