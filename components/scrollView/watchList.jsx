import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import Colors from '../../src/style';
import React from 'react';

import { getAllMovies } from "../../src/saveLoadWatchList"
import { baseUrl342, round, genreDict } from "../../src/helper"
import { FontText } from '../fontText';

export default class WatchList extends React.Component {

  constructor(props) {
    super(props);

    this.state = { list: new DataProvider((r1, r2) => r1 !== r2) };

    this.layoutProvider = new LayoutProvider((i) => {
      return this.state.list.getDataForIndex(i).type;
    }, (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = Dimensions.get('window').width;
          dim.height = 165
          break;
      };
    })
  }

  componentDidMount = async () => {

    const watchList = await getAllMovies()

    for (let i = 0; i < watchList.length; i++) {
      watchList[i]["type"] = "NORMAL"
    }

    this.setState({
      list: this.state.list.cloneWithRows(watchList),
    })
  }


  moveToMovie = async (data) => {
    console.log(data.title + ", " + data.id)
    this.props.navigation.push("MovieScreen", { jsonObject: data })
  }

  rowRenderer = (type, data) => {
    const { poster_path, title, release_date, vote_average, genre_ids } = data.movieData;
    return (

      <TouchableOpacity onPress={() => { this.moveToMovie(data.movieData) }} style={{ height: 150 }}>
        <View style={styles.listItem}>

          <View onPress={() => { this.moveToMovie(data.movieData) }} style={{ alignItems: "flex-start", flex: 1 }}>
            <Image style={styles.img} source={{ uri: baseUrl342 + poster_path }} />
          </View>

          <View style={{ marginLeft: 110, marginBottom: 2 }}>
            <FontText font={"Roboto-Bold"} fontSize={12} numberOfLines={2} >{title}</FontText>
          </View>

          <View style={styles.movieRatingRow}>
            <FontText color={Colors.mainColor} font={"Roboto-Bold"} fontSize={12}>{release_date.split("-")[0]}</FontText>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <Image source={require("../../assets/star-symbol.png")} style={[styles.topStar, { height: 10, width: 10 }]} />
                <FontText color={Colors.textColor} font={"Roboto-Bold"} fontSize={12}>{round(vote_average, 3)}</FontText>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", marginLeft: 110 }}>
            {genre_ids.map((genreID, key) => {
              return (<View key={key} style={styles.genresView}><FontText fontSize={12} font={"Roboto-Regular"} >{genreDict[genreID]}</FontText></View>)
            })}
          </View>

        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <RecyclerListView
          style={{ flex: 1 }}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.list}
          layoutProvider={this.layoutProvider}
          renderFooter={() => { return (<Text onLayout={this.props.footerPos} style={{ color: Colors.textColor, textAlign: "center" }}></Text>) }} />
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
  },
  movieRatingRow: {
    marginLeft: 110,
    marginBottom: 5,
    flexDirection: "row",
  },
  voteAverage: {
    color: Colors.textColor,
    fontSize: 16,
    marginTop: 5,
  },
  topStar: {
    marginTop: 3,
    marginRight: 3
  },
  genresView: {
    marginBottom: 5,
    marginRight: 10
  },
});