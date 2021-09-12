import { StyleSheet, View, Text } from 'react-native';
import Colors from '../src/style';
import React, { useEffect, useState } from 'react';

import { getAllMovies } from "../src/saveLoadWatchList"

const watchList = ({ navigation }) => {

  const [watchList, setWatchList] = useState([])

  useEffect(() => {
    getAsyncMovies()
  }, [])

  const getAsyncMovies = async () => {
    setWatchList(await getAllMovies())
  }

  
  return (
    <View style={styles.container}>
        <Text style={{color:Colors.textColor}}>My WatchList</Text>
        <Text style={{color:Colors.textColor}}>watchlist: {watchList.length}</Text>
    </View>
  );
}

export { watchList }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    alignItems:"center",
    justifyContent:"center",
    flex:1
  },
});
