import { StyleSheet, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Text } from 'react-native';

import MovieListVerticalScroll from '../components/scrollView/MovieListVerticalScroll';

import { FontAwesome, Feather } from '@expo/vector-icons';
import { FontText } from '../components/fontText';
import { TopBar } from '../components/topBar';

import Colors from '../src/style';
import React, { useState } from 'react';


import { genreDict, genreList } from "../src/helper"

const SearchPage = ({ navigation }) => {

  const [loadingMovies, setLoadingMovies] = useState(false)
  const [searchTimer, setSearchTimer] = useState(null)

  const userSearching = (text) => {
    setLoadingMovies(true)
    clearTimeout(searchTimer)
    setSearchTimer(setTimeout(() => {
      console.log(text)
      //this.setState({ userText: text, loadingMovies: false })
    }, 1000))
  }

  return (
    <View style={styles.container}>

      <TopBar navigation={navigation} extra="hideSearchBar" hambAction="goBack" />


      <View style={styles.innerView}>

        <FontText fontSize={20} font={"Roboto-Bold"}>Search</FontText>
        <TouchableOpacity style={styles.menuSearch}  >
          <FontAwesome style={styles.SearchIcon} name="search" size={18} color="black" />
          <TextInput
            style={styles.userInput}
            onChangeText={text => userSearching(text)}
            placeholder="Search for a movie"
            placeholderTextColor={Colors.textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollGenre}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            {genreList.map((genre, index) => {
              if (index % 2 == 0) {
                return (
                  <TouchableOpacity key={index} style={[styles.genreElement, { marginLeft: "25%", marginRight:"7%" }]}>
                    <FontText fontSize={15} font={"Roboto-Bold"}>{genre[0]}</FontText>
                  </TouchableOpacity>
                )
              }
            })}
          </View>
          <View style={{ flex: 1 }}>
            {genreList.map((genre, index) => {
              if (index % 2 == 1) {
                return (
                  <TouchableOpacity key={index} style={[styles.genreElement, { marginRight: "25%", marginLeft: "7%" }]}>
                    <FontText fontSize={15} font={"Roboto-Bold"}>{genre[0]}</FontText>
                  </TouchableOpacity>
                )
              }
            })}
          </View>
        </View>
      </ScrollView>


      <MovieListVerticalScroll id={"popular"} navigation={navigation} />


    </View>
  );
}

export { SearchPage }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
  innerView: {
    marginTop: "6%",
    marginLeft: "5%"
  },
  menuSearch: {
    marginTop: "5%",
  },
  userInput: {
    paddingLeft: 60,
    width: "95%",
    borderRadius: 25,
    height: 44,
    backgroundColor: Colors.darkLight,
    fontSize: 15,
    color: Colors.textColor
  },
  SearchIcon: {
    color: Colors.textColor,
    position: "absolute",
    zIndex: 100,
    height: "100%",
    paddingTop: 12,
    paddingLeft: 38,
  },
  genreElement: {
    height: 100,
    backgroundColor: Colors.darkLight,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "8%",
    borderRadius: 17

  },
  scrollGenre: {
    marginTop: "5%"
  }
});