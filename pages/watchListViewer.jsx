import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import Colors from '../src/style';

import WatchList from '../components/watchList';

import { TopBar } from '../components/topBar';

const watchList = ({ navigation }) => {


  return (
    <View style={styles.container}>

      <TopBar navigation={navigation} hambAction={"openD"}/>
      
      <View style={{paddingTop:"4%"}}>
        
      </View>

      <WatchList navigation={navigation} />
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

  mainMenu: {
    backgroundColor: Colors.mainColor,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,

  },
  menuHamburger: {
    margin: 10
  },
  menuLogo: {

  },
  menuSearch: {
    margin: 10
  }
});
