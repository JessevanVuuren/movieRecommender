import { StyleSheet, TouchableOpacity, View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import Colors from '../src/style';
import React from 'react';

import MovieList from '../components/movieList';

const movieGenres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science", "Fiction", "Thriller", "TV Movie", "War, an", "Wester",
]

export default class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.searchTimer = null

    this.state = {
      userText: "",
      loadingMovies: false
    }
  }

  userSearching(text) {
    this.setState({ loadingMovies: true })
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      console.log(text)
      this.setState({ userText: text, loadingMovies: false })
    }, 1500)
  }


  componentDidUpdate() { setTimeout(() => this._input.focus(), 250) }
  componentDidMount() { setTimeout(() => this._input.focus(), 250) }

  searchGenre(genre) {
    console.log(genre)
  }

  render() {
    return (

      <View style={styles.container}>
        <View style={{ backgroundColor: Colors.mainLight, height: Constants.statusBarHeight }}></View>
        <View style={styles.mainMenu}>
          <StatusBar style="light" />
          <TouchableOpacity style={styles.menuHamburger} onPress={() => this.props.navigation.openDrawer()}>
            <Text style={{ fontSize: 35, color: Colors.textColor }}>☰</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuSearch}  >
            <TextInput
              style={styles.userInput}
              onChangeText={text => this.userSearching(text)}
              autoFocus={true}
              ref={(c) => this._input = c}
              placeholder="Search..."
              placeholderTextColor={Colors.textColor} />
          </TouchableOpacity>


          <View style={styles.loadingMovies}>
            <ActivityIndicator size="large" color="#ffffff" animating={this.state.loadingMovies}/>
          </View>

        </View>

        <View style={styles.scrollViewFix} colors={['#4c669f', '#192f6a']}>
          <ScrollView horizontal={true} style={{ flexGrow: 1, flexWrap: "wrap" }}>
            {movieGenres.map((genre, key) => {
              return (<TouchableOpacity onPress={() => this.searchGenre(genre)} key={key} style={styles.genresView}><Text style={styles.genresText}>{genre}</Text></TouchableOpacity>)
            })}
          </ScrollView>

        </View >

        <MovieList list="search" searchQuery={this.state.userText} topPadding={"2%"} navigation={this.props.navigation} key={this.state.userText}/>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
  mainMenu: {
    justifyContent:"center",


    backgroundColor: Colors.mainColor,
    flexDirection: "row",
    height: 50,
  },
  menuHamburger: {
    marginLeft: "2%",
    width: "8%"
  },
  loadingMovies:{
    height:50,
    marginRight:"3%",
    justifyContent:"center"
  },
  userInput: {
    paddingLeft: 20,
    height: 50,
    backgroundColor: Colors.mainColor,
    fontSize: 20,
    color: Colors.textColor
  },
  menuSearch: {
    width: "80%"
  },
  genresView: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 3,
    marginRight: 10,
    marginTop: 10,
    borderStyle: "solid",
    borderColor: Colors.mainColor,
    borderWidth: 1,
    borderRadius: 100
  },
  genresText: {
    fontSize: 15,
    color: Colors.textColor,
  },
  scrollViewFix: {
    height: 50
  },
});
