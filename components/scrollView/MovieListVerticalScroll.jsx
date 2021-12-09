import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React from 'react';


import { MatchingMovies, baseUrl342, SearchMovie, getNowPlaying, getUpComing, getTopRated, getPopular, GenreMovie } from "../../src/helper"
import { FontText } from '../fontText';
import Colors from '../../src/style';


const SCREEN_WIDTH = Dimensions.get('window').width

export default class MovieListVerticalScroll extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      doneLoading: false,
      list: new DataProvider((r1, r2) => r1 !== r2),
      imageSize: this.calcImgSize(),
      pageCount: 1,
      megaList: [],
      currentPageCount: 0,
    };

    this.layoutProvider = new LayoutProvider((i) => {
      return this.state.list.getDataForIndex(i).type;
    }, (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = (SCREEN_WIDTH - this.calcPadding(4)) / 3;
          dim.height = this.state.imageSize.height + this.calcPadding(3.5)
          break;
        case 'COMP':
          dim.width = SCREEN_WIDTH;
          dim.height = 280 * this.props.component.length
          break;
        case 'TITLE':
          dim.width = SCREEN_WIDTH;
          dim.height = 50
          break;
        case 'SEARCH':
          dim.width = SCREEN_WIDTH;
          dim.height = 10
      };
    })
  }

  calcPadding(percent) {
    const percentOf = SCREEN_WIDTH / 100 * percent
    return Math.ceil(percentOf)
  }

  calcImgSize() {
    const widthOri = 342
    const heightOri = 513
    const imgWith = Dimensions.get('window').width / 3 - this.calcPadding(5)

    const percentDec = (widthOri - imgWith) / widthOri * 100
    const newHeight = heightOri - (heightOri / 100 * percentDec)


    return { width: imgWith, height: newHeight }
  }

  getMovieList = async (initialize) => {
    let urlToFetch = ""

    if (this.props.id == "nowPlaying") urlToFetch = getNowPlaying + "1"
    else if (this.props.id == "upComing") urlToFetch = getUpComing + "1"
    else if (this.props.id == "topRated") urlToFetch = getTopRated + "1"
    else if (this.props.id == "genreSearch") urlToFetch = GenreMovie[0] + this.props.searchQuery + GenreMovie[1] + this.state.pageCount
    else if (this.props.id == "popular") urlToFetch = getPopular + this.state.pageCount
    else if (this.props.id == "search") {
      if (this.props.searchQuery == "") return
      urlToFetch = SearchMovie[0] + this.props.searchQuery + SearchMovie[1] + "1"
    }

    else urlToFetch = MatchingMovies[0] + this.props.id + MatchingMovies[1] + "1"


    console.log("Get matching movies: " + urlToFetch)
    const getMovies = await fetch(urlToFetch)
    const json = await getMovies.json()

    const fullList = []

    if (initialize) {
      fullList.push({ type: "COMP", item: "" })

      if (this.props.id == "popular") fullList.push({ type: "TITLE", item: "Popular" })
      else fullList.push({ type: "SEARCH", item: "search" })
    }


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

  componentDidMount() { this.getMovieList(true) }

  checkIfEnd() {
    if (this.state.currentPageCount > this.state.pageCount) {
      this.getMovieList(false)
    }
  }

  moveToMovie = async (movie) => {
    console.log(movie.title + ", " + movie.id)
    this.props.navigation.push("MovieScreen", { jsonObject: movie })
  }

  rowRenderer = (type, data) => {


    switch (type) {
      case "COMP":
        return (
          <View>
            {this.props.component.map((Comp, index) =>
              <Comp key={index} navigation={this.props.navigation} />
            )}
          </View>
        )
      case "TITLE":
        return (
          <View style={{ marginLeft: "4%" }}>
            <FontText fontSize={30} font={"Roboto-Bold"}>Popular</FontText>
          </View>
        )
      case "SEARCH":
        return (<View></View>)
      case "NORMAL":
        const { poster_path, title, release_date, vote_average } = data.item;
        return (
          <View style={styles.listItem}>
            <TouchableOpacity onPress={() => { this.moveToMovie(data.item) }}>
              <Image style={[styles.img, { width: this.state.imageSize.width, height: this.state.imageSize.height }]} source={{ uri: baseUrl342 + poster_path }} />

            </TouchableOpacity>
          </View>
        )
    }
  }



  render() {
    if (!this.state.doneLoading) return null
    return (
      <View style={styles.container} >
        <RecyclerListView

          style={{ flex: 1 }}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.list}
          layoutProvider={this.layoutProvider}
          onEndReached={() => this.checkIfEnd()}
          onEndReachedThreshold={300}
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
    // alignSelf:"center",
    // alignItems:"center"
    // marginLeft: "10.5%"
    marginLeft:"12.3%"
  },
  img: {
    borderRadius: 10,
  },
  movieRatingRow: {
    marginBottom: 10,
    flexDirection: "row",
  },
  bottomList: { flexDirection: "row", },

  voteAverage: {
    color: Colors.textColor,
    fontSize: 16,
    marginTop: 5,
  },
  topStar: {
    marginTop: 3,
    marginRight: 3
  },
});