import { StyleSheet, View, TextInput, TouchableOpacity, Animated, ScrollView, Easing } from 'react-native';

import MovieListVerticalScroll from '../components/scrollView/MovieListVerticalScroll';

import { FontAwesome, Feather } from '@expo/vector-icons';
import { FontText } from '../components/fontText';
import { TopBar } from '../components/topBar';

import { genreList } from "../src/helper";
import React, { useState, useRef } from 'react';
import Colors from '../src/style';

const TopRated = ({ navigation }) => {

}

const SearchPage = ({ navigation }) => {

  const hideGenreRef = useRef(new Animated.Value(1)).current  // Initial value for opacity: 0
  const showVideoRef = useRef(new Animated.Value(0.01)).current  // Initial value for opacity: 0

  const [loadingMovies, setLoadingMovies] = useState(false)
  const [searchTimer, setSearchTimer] = useState(null)
  const [searchText, setSearchText] = useState("")

  const hideGenreAnim = () => { Animated.timing(hideGenreRef, { toValue: 0.01, duration: 500, useNativeDriver: true }).start() }
  const showGenreAnim = () => { Animated.timing(hideGenreRef, { toValue: 1, duration: 500, useNativeDriver: true }).start() }
  const showVideoAmin = () => { Animated.timing(showVideoRef, { toValue: 1, useNativeDriver: true }).start() }
  const hideVideoAmin = () => { Animated.timing(showVideoRef, { toValue: 0.01, useNativeDriver: true }).start() }

  const userSearching = (text) => {
    if (text.length > 0) hideGenreAnim()
    else hideVideoAmin()

    setLoadingMovies(true)
    clearTimeout(searchTimer)
    setSearchTimer(setTimeout(() => {
      setSearchText(text)
      if (text.length < 1) showGenreAnim()
      else showVideoAmin()
    }, 950))
  }

  const goToGenre = (genre) => {
    navigation.push("GenrePage", { genre: genre })
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} extra="hideSearchBar" hambAction="goBack" />

      <View style={styles.innerView}>
        <FontText fontSize={25} font={"Roboto-Bold"}>Search</FontText>
        <TouchableOpacity style={styles.menuSearch}  >
          <FontAwesome style={styles.SearchIcon} name="search" size={18} color="black" />
          <TextInput
            style={styles.userInput}
            onChangeText={text => userSearching(text)}
            placeholder="Search for a movie"
            placeholderTextColor={Colors.textColor} />
        </TouchableOpacity>
      </View>


      {searchText == "" ? (
        <Animated.View style={{ opacity: hideGenreRef }}>

          <ScrollView style={styles.scrollGenre}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                {genreList.map((genre, index) => {
                  if (index % 2 == 0) {
                    return (
                      <TouchableOpacity onPress={() => goToGenre(genre[1])} key={index} style={[styles.genreElement, { marginLeft: "25%", marginRight: "7%" }]}>
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
                      <TouchableOpacity onPress={() => goToGenre(genre[1])} key={index} style={[styles.genreElement, { marginRight: "25%", marginLeft: "7%" }]}>
                        <FontText fontSize={15} font={"Roboto-Bold"}>{genre[0]}</FontText>
                      </TouchableOpacity>
                    )
                  }
                })}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: showVideoRef }}>
          <MovieListVerticalScroll id={"search"} navigation={navigation} component={[]} searchQuery={searchText} key={searchText} />
        </Animated.View>
      )}
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
    
    marginLeft: "4%"
  },
  menuSearch: {
    marginTop: "5%",
  },
  userInput: {
    paddingLeft: 60,
    width: "96%",
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



