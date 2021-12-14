
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React from 'react';

import { MatchingMovies, baseUrl342, round, getNowPlaying, getUpComing, getTopRated, ActorList } from "../../src/helper"
import { FontText } from '../fontText';
import Colors from '../../src/style';


export default class MovieListScroll extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      doneLoading: false,
      currentPageCount: 0,
      megaList: [],
      pageCount: 1,
      list: new DataProvider((r1, r2) => r1 !== r2),
    };

    this.layoutProvider = new LayoutProvider((i) => {
      return this.state.list.getDataForIndex(i).type;
    }, (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = 100 + (Dimensions.get('window').width * 0.04);
          dim.height = 200
          break;
      };
    })
  }

  componentDidMount() {this.loadMovies()}

  loadMovies = async () => {
    let urlToFetch = ""

    if (this.props.id == "nowPlaying") urlToFetch = getNowPlaying + "1"
    else if (this.props.id == "upComing") urlToFetch = getUpComing + "1"
    else if (this.props.id == "topRated") urlToFetch = getTopRated + "1"
    else if (this.props.id == "actorMovieList") urlToFetch = ActorList[0] + this.props.actorID + ActorList[1] + this.state.pageCount
    else urlToFetch = MatchingMovies[0] + this.props.id + MatchingMovies[1] + "1"


    console.log("Get movies: " + urlToFetch)
    const getMovies = await fetch(urlToFetch)
    const json = await getMovies.json()

    const fullList = []
    for (let i = 0; i < json.results.length; i++) {
      if (json.results[i].poster_path != null || json.results[i].backdrop_path != null) {
        fullList.push({
          type: "NORMAL",
          item: json.results[i]
        })
      }
    }

    if (fullList.length > 0) {
      this.setState({
        list: this.state.list.cloneWithRows([...this.state.megaList, ...fullList]),
        megaList: [...this.state.megaList, ...fullList],

        doneLoading: true,
        pageCount: this.state.pageCount + 1,
        currentPageCount: json.total_pages
      })
    }




  }

  moveToMovie = async (movie) => {
    console.log(movie.title + ", " + movie.id)
    this.props.navigation.push("MovieScreen", { jsonObject: movie })
  }

  rowRenderer = (type, data) => {
    const { poster_path, title, release_date, vote_average } = data.item;
    return (

      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => {this.moveToMovie(data.item)}}>
          <Image style={styles.img} source={{ uri: baseUrl342 + poster_path }} />
  
          <FontText font={"Roboto-Bold"} fontSize={12} numberOfLines={2} >{title}</FontText>

          <View style={styles.movieRatingRow}>
            <FontText color={Colors.mainColor} font={"Roboto-Bold"} fontSize={12}>{release_date.split("-")[0]}</FontText>
            <View style={{ alignItems:"center", flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <Image source={require("../../assets/star-symbol.png")} style={[styles.topStar, { height: 10, width: 10 }]} />
                <FontText color={Colors.textColor} font={"Roboto-Bold"} fontSize={12}>{round(vote_average, 3)}</FontText>
              </View>
            </View>
          </View>


        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (!this.state.doneLoading) return null
    return (
      <View style={styles.container} >
        <RecyclerListView
          isHorizontal={true}
          style={{ flex: 1 }}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.list}
          layoutProvider={this.layoutProvider}
          onEndReached={() => { if (this.props.id == "actorMovieList") this.loadMovies()}}
          renderFooter={() => { return (<View style={{ width: Dimensions.get('window').width * 0.04 }}><Text>hey!</Text></View>) }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listItem: {
    paddingLeft: Dimensions.get('window').width * 0.04,
  },
  img: {
    height: 150,
    width: 100,
    borderRadius: 10,
    marginBottom: 5
  },
  movieRatingRow: {
    marginBottom:10,
    flexDirection: "row",
  },

  voteAverage: {
    color: Colors.textColor,
    fontSize: 16,
    marginTop: 5,
  },
  topStar: {
    marginTop:3,
    marginRight:3
  },
});