import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MovieList from '../components/movieList';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import Colors from '../src/style';
import React from 'react';



const Home = ({ navigation }) => {

  return (
    
    <View style={styles.container}>
      <View style={{ backgroundColor: Colors.mainDark, height:Constants.statusBarHeight}}></View>
      <View style={styles.mainMenu}>
        <StatusBar style="light" />
        <TouchableOpacity style={styles.menuHamburger} onPress={() => navigation.openDrawer()}>
          <Text style={{ fontSize: 35, color: Colors.textColor }}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuLogo}>
          <Text style={{ fontSize: 20, color: Colors.textColor }}>Movie Recommender</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuSearch} onPress={() => {navigation.navigate('SearchPage')}} >
          <FontAwesome style={{ color: Colors.textColor }} name="search" size={30} color="black" />
        </TouchableOpacity>
      </View>



      <MovieList list="popular" topPadding={"2%"} navigation={navigation} />
    </View>
  );
}

export { Home }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
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