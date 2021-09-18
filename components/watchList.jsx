
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React, { Component } from 'react';
import Colors from '../src/style';

import { getAllMovies } from "../src/saveLoadWatchList"


export default class WatchList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list: new DataProvider((r1, r2) => r1 !== r2),
    };

    this.layoutProvider = new LayoutProvider((i) => {
      return this.state.list.getDataForIndex(i).type;
    }, (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = Dimensions.get('window').width;
          dim.height = 140
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
    const { title, date, poster_path } = data["movieData"];
    return (

      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => { this.moveToMovie(data["movieData"]) }}>
          <Image style={{ height: 130, width: 90 }} source={{ uri: "https://image.tmdb.org/t/p/w342/" + poster_path}} />
          <View style={styles.textView}>
            <Text style={[styles.castName, { color: Colors.textColor }]}>{title}</Text>
            <Text style={[styles.castName, { color: Colors.mainColor }]}>{date}</Text>

          </View>
        </TouchableOpacity>
      </View>
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
  castName: {
    fontSize: 17,
    fontWeight: "bold"
  },
  textView: {
    position: "absolute",
    marginLeft: 100
  },
  container: {
    flex: 1
  },
  listItem: {
    width: "100%",
    marginHorizontal: 15,
    marginBottom: 10
  },
  imageTouch: {
    width: 80,

  }
});