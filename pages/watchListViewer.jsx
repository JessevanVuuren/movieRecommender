import { StyleSheet, View, Text, Button } from 'react-native';
import Colors from '../src/style';
import React, { useEffect, useState } from 'react';

import { getAllMovies } from "../src/saveLoadWatchList"
import WatchList from '../components/watchList';


const watchList = ({ route, navigation }) => {


  const [watchList, setWatchList] = useState([])
  const [newNumber, setNewNumber] = useState(1)

  const { number } = route.params;

  React.useEffect(() => {
    setNewNumber(Math.random)
    const willFocusSubscription = navigation.addListener('focus', () => {
      setNewNumber(Math.random)
    });

    return willFocusSubscription;
  }, []);


  return (
    <View style={styles.container}>
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
