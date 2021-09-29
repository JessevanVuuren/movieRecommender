import { StyleSheet, TouchableOpacity, View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import Colors from '../src/style';
import React from 'react';

import MovieList from '../components/movieList';

const movieGenres = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Science", "Fiction", "Thriller", "TV Movie", "War, an", "Wester",
]

const genreList = [["Action",28],["Adventure",12],["Animation",16],["Comedy",35],["Crime",80],["Documentary",99],["Drama",18],["Family",10751],["Fantasy",14],["History",36],["Horror",27],["Music",10402],["Mystery",9648],["Romance",10749],["Science Fiction",878],["TV Movie",10770],["Thriller",53],["War",10752],["Western",37]]



export default class SearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.searchTimer = null

    this.state = {
      userText: "",
      loadingMovies: false,
      genreSearchList: [],
      update: 1
    }
  }

  userSearching(text) {
    this.setState({ loadingMovies: true })
    clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.setState({ userText: text, loadingMovies: false })
    }, 1000)
  }


  componentDidUpdate() { 
    if(this.state.genreSearchList.length == 0) {
      setTimeout(() => this._input.focus(), 250)
    }
   }
  componentDidMount() { setTimeout(() => this._input.focus(), 250) }

  searchGenre(genre) {

    if(this.state.genreSearchList.includes(genre)){
      const index = this.state.genreSearchList.indexOf(genre)
      this.state.genreSearchList.splice(index, 1)      
    }
    else {
      this.state.genreSearchList.push(genre)
    }
    this.userSearching(this.state.genreSearchList.length.toString())
    this.setState({update: this.state.update + 1})
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
            <ActivityIndicator size="large" color="#ffffff" animating={this.state.loadingMovies} />
          </View>

        </View>

        <View style={styles.scrollViewFix} colors={['#4c669f', '#192f6a']}>
          <ScrollView horizontal={true} style={{ flexGrow: 1, flexWrap: "wrap" }}>

            {genreList.map((genre, key) => {
              return (
                <TouchableOpacity onPress={() => this.searchGenre(genre)} key={genre[1] + this.state.update} style={[styles.genresView, { backgroundColor: this.state.genreSearchList.includes(genre) ? Colors.mainColor : Colors.background }]}>
                  <Text style={styles.genresText}>{genre[0]}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View >

        <MovieList list="search" searchQuery={this.state.userText} genreArray={this.state.genreSearchList} topPadding={"2%"} navigation={this.props.navigation} key={this.state.userText} />
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
    justifyContent: "center",


    backgroundColor: Colors.mainColor,
    flexDirection: "row",
    height: 50,
  },
  menuHamburger: {
    marginLeft: "2%",
    width: "8%"
  },
  loadingMovies: {
    height: 50,
    marginRight: "3%",
    justifyContent: "center"
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
    color: Colors.textColor
  },
  scrollViewFix: {
    height: 50
  },
});
