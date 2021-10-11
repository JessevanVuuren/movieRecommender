import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import Colors from '../src/style';

import WatchList from '../components/watchList';


const watchList = ({ route, navigation }) => {

  const [newNumber, setNewNumber] = useState(1)

  useEffect(() => {
    const willFocusSubscription = navigation.addListener('focus', () => {
      setNewNumber(Math.random)
    });
    setNewNumber(Math.random)

    return willFocusSubscription;
  }, []);

  

  return (
    <View style={styles.container}>

      <View style={{ backgroundColor: Colors.mainDark, height: Constants.statusBarHeight }}></View>
      <View style={styles.mainMenu}>
        <StatusBar style="light" />
        <TouchableOpacity style={styles.menuHamburger} onPress={() => navigation.openDrawer()}>
          <Text style={{ fontSize: 35, color: Colors.textColor }}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuLogo}>
          <Text style={{ fontSize: 20, color: Colors.textColor }}>Movie Recommender</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuSearch} onPress={() => { navigation.navigate('SearchPage') }} >
          <FontAwesome style={{ color: Colors.textColor }} name="search" size={30} color="black" />
        </TouchableOpacity>
      </View>


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
