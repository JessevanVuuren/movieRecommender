
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import * as Linking from 'expo-linking';
import React, { Component } from 'react';

import { getVideos } from "../../src/helper"

import { FontText } from '../fontText';

import Colors from '../../src/style';


export default class VideoPlayerScroll extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      doneLoading: false,
      list: new DataProvider((r1, r2) => r1 !== r2),
    };

    this.layoutProvider = new LayoutProvider((i) => {
      return this.state.list.getDataForIndex(i).type;
    }, (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = 213 + (Dimensions.get('window').width * 0.04);
          dim.height = 120
          break;
      };
    })
  }

  componentDidMount = async () => {
    console.log("Get videos: " + getVideos[0] + this.props.id + getVideos[1])
    const getMovies = await fetch(getVideos[0] + this.props.id + getVideos[1])
    const json = await getMovies.json()

    const fullList = []
    for (let i = 0; i < json.results.length; i++) {
      fullList.push({
        type: "NORMAL", 
        item: json.results[i]
      })
    }


    this.setState({
      list: this.state.list.cloneWithRows( fullList),
      doneLoading: true
    })
  }

  rowRenderer = (type, data) => {
    const { key, name } = data.item;
    return (

      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => Linking.openURL("http://www.youtube.com/watch?v=" + key)}>
          <View style={styles.playButton}>
            <Image style={styles.playImg} source={require("../../assets/play.png")} />
          </View>
          <Image style={styles.img} source={{ uri: "https://img.youtube.com/vi/" + key + "/mqdefault.jpg" }} />
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
          renderFooter={() => { return (<View style={{ width: Dimensions.get('window').width * 0.04 }}></View>) }} />
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
  playButton:{
    justifyContent:"center",
    position:"absolute",
    alignSelf:"center",
    opacity:0.6,
    height:120,
    zIndex:10,
    
  },
  playImg:{

    height:20,
    width:20
  },

  videoText: {
    color:Colors.textColor,
  },

  img: {
    height: 120,
    width: 213,
    borderRadius: 10,
    marginBottom:10
  }

});