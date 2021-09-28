import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React from 'react';
import Colors from '../src/style';

import { EXPO_API_URL } from '@env'


const SCREEN_WIDTH = Dimensions.get('window').width
const ratio = SCREEN_WIDTH / 500

const PopularMovieLink = "https://api.themoviedb.org/3/movie/popular?api_key=" + EXPO_API_URL + "&language=en-US&page="
const RecommendedMovie = ["https://api.themoviedb.org/3/movie/", "/recommendations?api_key=" + EXPO_API_URL + "&language=en-US&page="]
const SearchMovie = ["https://api.themoviedb.org/3/search/movie?api_key=" + EXPO_API_URL + "&language=en-US&query=", "&include_adult=false&page="]
const GenreMovie = ["https://api.themoviedb.org/3/discover/movie?api_key=" + EXPO_API_URL + "&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_genres=35&with_watch_monetization_types=flatrate"]


const baseImageLink = "https://image.tmdb.org/t/p/w342"

export default class MovieList extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      list: new DataProvider((r1, r2) => r1 !== r2),
      disableFetching: false,
      leftOverMovie: [],
      megaList: [],
      pageInt: 0,
    };

    this.layoutProvider = new LayoutProvider((i) => {
      return this.state.list.getDataForIndex(i).type;
    }, (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = SCREEN_WIDTH;
          dim.height = (ratio * 750 / 3);
          break;
      };
    })
  }

  loadMovieData = () => {
    let dataList = []
    if (this.state.disableFetching) return

    this.setState({ pageInt: this.state.pageInt + 1 }, () => {

      if (this.props.list == "popular") url = PopularMovieLink
      if (this.props.list == "recommended") url = RecommendedMovie[0] + this.props.id + RecommendedMovie[1]
      if (this.props.list == "search") {
        if (this.props.searchQuery == "") {
          return
        }
        url = SearchMovie[0] + this.props.searchQuery + SearchMovie[1]
      }


      console.log(url + this.state.pageInt)
      fetch(url + this.state.pageInt)
        .then((res) => res.json())
        .then((newData) => { dataList = newData })
        .catch((error) => alert(error))
        .finally(() => {

          let cleanArray = []

          if (this.props.list == "search") {

            console.log("len before " + dataList.results.length)
            for (let i = 0; i < dataList.results.length; i++) {
              if (dataList.results[i].backdrop_path && dataList.results[i].poster_path) {
                cleanArray.push(dataList.results[i])
              }
            }
            console.log("len after " + cleanArray.length)
          }
          else {
            cleanArray = dataList.results
          }


          let compressList = []

          if (this.state.leftOverMovie.length == 1) cleanArray.unshift(this.state.leftOverMovie[0])
          if (this.state.leftOverMovie.length == 2) cleanArray.unshift(this.state.leftOverMovie[0], this.state.leftOverMovie[1])

          this.state.leftOverMovie.length = 0

          for (let i = 0; i < cleanArray.length; i += 3) {

            if (i + 2 >= cleanArray.length || i + 1 >= cleanArray.length) {
              if (i == cleanArray.length - 2) this.state.leftOverMovie.push(cleanArray[i], cleanArray[i + 1])
              if (i == cleanArray.length - 1) this.state.leftOverMovie.push(cleanArray[i])



              if (cleanArray.length < 9 && this.state.pageInt <= dataList.total_pages) { this.loadMovieData(); break }
              if (this.state.pageInt <= dataList.total_pages) break
              if (dataList.results.length == 0) this.setState({ disableFetching: true })
              if (this.props.list == "recommended") this.setState({ disableFetching: true })
              else if (this.props.list == "popular") break
            }


            compressList.push({
              type: "NORMAL",
              item: {
                movieOne: cleanArray[i],
                movieTwo: i + 1 >= cleanArray.length ? "empty" : cleanArray[i + 1],
                movieThr: i + 2 >= cleanArray.length ? "empty" : cleanArray[i + 2],
              }
            })
          }



          this.setState({
            list: this.state.list.cloneWithRows([...this.state.megaList, ...compressList]),
            megaList: [...this.state.megaList, ...compressList]
          })


          console.log("loaded new data form page: " + this.state.pageInt + ", " + this.state.megaList.length + " in megalist Length")
        })
    })
  }

  increaseList = () => { this.loadMovieData() }
  componentDidMount() { this.loadMovieData() }

  moveToMovie = async (movie) => {
    if (movie.title != undefined) {
      console.log(movie.title + ", " + movie.id)
      this.props.navigation.push("MovieScreen", { jsonObject: movie })
    }

  }

  rowRenderer = (type, data) => {
    const { movieOne, movieTwo, movieThr } = data.item;
    return (

      <View style={styles.listItem}>
        <TouchableOpacity style={styles.imageTouch} onPress={() => { this.moveToMovie(movieOne) }}>
          <Image style={{ height: "100%", width: "100%" }} source={{ uri: baseImageLink + movieOne.poster_path }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageTouch} onPress={() => { this.moveToMovie(movieTwo) }}>
          <Image style={{ height: "100%", width: "100%" }} source={{ uri: baseImageLink + movieTwo.poster_path }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageTouch} onPress={() => { this.moveToMovie(movieThr) }}>
          <Image style={{ height: "100%", width: "100%" }} source={{ uri: baseImageLink + movieThr.poster_path }} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (this.state.megaList.length <= 0) {
      return (
        <View style={styles.movieLoading}>
          <Text style={styles.movieLoadingText}></Text>
          {/* <Text style={styles.movieLoadingText}>{this.props.list == "recommended" ? "No movies where found, please come back later" : "loading..."}</Text> */}
        </View>
      )
    }
    return (
      <View style={styles.container} >
        <RecyclerListView
          style={{ flex: 1 }}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.list}
          layoutProvider={this.layoutProvider}
          onEndReached={this.increaseList}
          onEndReachedThreshold={300}
          onScroll={this.props.onScrollList}
          renderFooter={() => { return (<Text onLayout={this.props.footerPos} style={{ color: Colors.textColor, textAlign: "center" }}></Text>) }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageTouch: {
    marginTop: "2%",
    marginHorizontal: "1%",
    width: "31.333%",
  },
  listItem: {
    flexDirection: 'row',
    flex: 1,
  },
  movieLoading: {
    height: 100,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  movieLoadingText: {
    color: Colors.textColor,
    textAlign: "center"
  }
});












// black widow 497698
// The Simpsons: The Good, the Bart, and the Loki 846214
// morgen war 588228

// get popular movies = https://api.themoviedb.org/3/movie/popular?api_key=648d096ec16e3f691572593e44644d30&language=en-US&page=1
// recommended movies = https://api.themoviedb.org/3/movie/497698/recommendations?api_key=648d096ec16e3f691572593e44644d30&language=en-US&page=1

// info = https://api.themoviedb.org/3/movie/588228?api_key=648d096ec16e3f691572593e44644d30&language=en-US
// poster = https://image.tmdb.org/t/p/original/xipF6XqfSYV8DxLqfLN6aWlwuRp.jpg
// banner = https://image.tmdb.org/t/p/original/yizL4cEKsVvl17Wc1mGEIrQtM2F.jpg
// get watch loc = https://api.themoviedb.org/3/movie/497698/watch/providers?api_key=648d096ec16e3f691572593e44644d30

// cast = https://api.themoviedb.org/3/movie/588228/credits?api_key=648d096ec16e3f691572593e44644d30&language=en-US
// picture = https://image.tmdb.org/t/p/original/gXKyT1YU5RWWPaE1je3ht58eUZr.jpg


// "backdrop_sizes": [
//   "w300",
//   "w780",
//   "w1280",
//   "original"
// ],
// "logo_sizes": [
//   "w45",
//   "w92",
//   "w154",
//   "w185",
//   "w300",
//   "w500",
//   "original"
// ],
// "poster_sizes": [
//   "w92",
//   "w154",
//   "w185",
//   "w342",
//   "w500",
//   "w780",
//   "original"
// ],
// "profile_sizes": [
//   "w45",
//   "w185",
//   "h632",
//   "original"
// ],
// "still_sizes": [
//   "w92",
//   "w185",
//   "w300",
//   "original"
// ]