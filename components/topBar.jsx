import { StyleSheet, View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { FontAwesome, Feather } from '@expo/vector-icons';
import React, { useState } from "react"
import Colors from '../src/style'
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import { FontText } from "../components/fontText"


export const TopBar = (props) => {





  return (
    <View>
      <View style={{ backgroundColor: Colors.background, height: Constants.statusBarHeight }}></View>
      <View style={styles.mainMenu}>
        <StatusBar style="light" />
        <TouchableOpacity style={styles.menuHamburger} onPress={() => props.navigation.openDrawer()}>
          <Feather name="menu" size={30} color="white" />
        </TouchableOpacity>


        <View style={styles.searchBar}>
          <View style={styles.menuSearch}>
            <View style={{justifyContent:"center"}}>
              <FontAwesome style={{ color: Colors.textColor }} name="search" size={15} color="black" />
            </View>
            <View style={{marginLeft:10}}>
              <FontText font={"Roboto-Medium"} fontSize={15}>Search for a movie</FontText>
            </View>
          </View>
        </View>
      </View>



      {/* <View style={{ backgroundColor: Colors.mainDark, height:Constants.statusBarHeight}}></View>
      <View style={styles.mainMenu}>
        <StatusBar style="light" />
        <TouchableOpacity style={styles.menuHamburger} onPress={() => props.navigation.openDrawer()}>
          <Feather name="menu" size={40} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuLogo}>
          <Text style={{ fontSize: 20, color: Colors.textColor }}>Movie Recommender</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuSearch} onPress={() => {props.navigation.navigate('SearchPage')}} >
          <FontAwesome style={{ color: Colors.textColor }} name="search" size={30} color="black" />
        </TouchableOpacity>
      </View> */}

    </View>
  );
}

const styles = StyleSheet.create({
  mainMenu: {
    backgroundColor: Colors.background,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
  },
  menuHamburger: {
    marginLeft: "5%",
  },
  menuSearch: {
    marginLeft: 10,
    flexDirection: "row",
  },
  searchBar: {
    height: 30,
    width: "60%",
    borderRadius: 25,
    marginRight: "20%",
    justifyContent: "center",
    backgroundColor: Colors.darkLight
  }
})