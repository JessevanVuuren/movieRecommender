
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React, { Component } from 'react';

import InView from 'react-native-component-inview'

const SCREEN_WIDTH = Dimensions.get('window').width
const ratio = SCREEN_WIDTH / 500

const PopularMovieLink = "https://api.themoviedb.org/3/movie/popular?api_key=648d096ec16e3f691572593e44644d30&language=en-US&page="


const simList = ["https://api.themoviedb.org/3/movie/", "/similar?api_key=648d096ec16e3f691572593e44644d30&language=en-US&page="]
const RecommendedMovie = ["https://api.themoviedb.org/3/movie/", "/recommendations?api_key=648d096ec16e3f691572593e44644d30&language=en-US&page="]
const baseImageLink = "https://image.tmdb.org/t/p/w500"

export default class MovieList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list: new DataProvider((r1, r2) => r1 !== r2),
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
          dim.height =(ratio * 750 / 3);
          break;
      };
    })
  }

  loadMovieData = () => {
    let dataList = []
    this.setState({ pageInt: this.state.pageInt + 1 }, () => {

      if (this.props.list == "popular") { url = PopularMovieLink }
      if (this.props.list == "recommended") { url = RecommendedMovie[0] + this.props.id + RecommendedMovie[1] }

      fetch(url + this.state.pageInt)
        .then((res) => res.json())
        .then((newData) => { dataList = newData.results })
        .catch((error) => alert(error))
        .finally(() => {


          let compressList = []

          if (this.state.leftOverMovie.length == 1) dataList.unshift(this.state.leftOverMovie[0])
          if (this.state.leftOverMovie.length == 2) dataList.unshift(this.state.leftOverMovie[0], this.state.leftOverMovie[1])

          this.state.leftOverMovie.length = 0

          for (let i = 0; i < dataList.length; i += 3) {

            if (i + 2 >= dataList.length || i + 1 >= dataList.length) {
              if (i == dataList.length - 2) this.state.leftOverMovie.push(dataList[i], dataList[i + 1])
              if (i == dataList.length - 1) this.state.leftOverMovie.push(dataList[i])
              break
            }

            compressList.push({
              type: "NORMAL",
              item: {
                movieOne: dataList[i],
                movieTwo: i + 1 >= dataList.length ? "empty" : dataList[i + 1],
                movieThr: i + 2 >= dataList.length ? "empty" : dataList[i + 2],
              }
            })
          }

          this.setState({
            list: this.state.list.cloneWithRows([...this.state.megaList, ...compressList]),
            megaList: [...this.state.megaList, ...compressList]
          })

          console.log("loaded new data form page: " + this.state.pageInt + ", added: " + this.state.leftOverMovie.length + " in cache")
        })
    })
  }

  increaseList = () => {
    this.loadMovieData()
  }
  componentDidMount() {
    this.loadMovieData()
  }


  moveToMovie = async (movie) => {
    console.log(movie.title + ", " + movie.id)
    this.props.navigation.push("Movie", { jsonObject: movie })
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
    if (this.state.megaList.length <= 0) return null
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
          renderFooter={() => {
            return (
              <Text 

              onLayout={this.props.footerPos}
              
              style={{color:"#fff", textAlign:"center"}}>loading...</Text>
            )
          }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "3.33%",
  },

  imageTouch: {
    marginHorizontal:"1%",
    marginBottom: "2%",
    width: "31.333%",

  },
  listItem: {
    flexDirection: 'row',
    flex: 1,
  },
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