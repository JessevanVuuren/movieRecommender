import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import * as Linking from 'expo-linking';
import React from 'react';


import { ActorImgs, baseUrl342 } from "../../src/helper"
import Colors from '../../src/style'



export default class ActorImgViewer extends React.Component {

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
        case 'IMGwide':
          dim.width = 220 + (Dimensions.get('window').width * 0.04);
          dim.height = 120
          break;
        case 'IMGhigh':
          dim.width = 80 + (Dimensions.get('window').width * 0.04);
          dim.height = 120
          break;
      };
    })
  }

  componentDidMount = async () => {
    console.log("Get tagged images: " + ActorImgs[0] + this.props.id + ActorImgs[1] + "1")
    const getMovies = await fetch(ActorImgs[0] + this.props.id + ActorImgs[1] + "1")
    const json = await getMovies.json()
    console.log("lenthOfImg: " + json.results.length)

    const fullList = []
    for (let i = 0; i < json.results.length; i++) {
      if (json.results[i].width == 1800) {
        fullList.push({
          type: "IMGhigh", 
          item: json.results[i]
        })
      }
      if (json.results[i].width == 1920) {
        fullList.push({
          type: "IMGwide",
          item: json.results[i]
        })
      }
    }


    this.setState({
      list: this.state.list.cloneWithRows( fullList),
      doneLoading: true
    })
  }

  rowRenderer = (type, data) => {
    const { file_path } = data.item;

    switch(type) {
      case "IMGhigh":
        return (
          <View style={styles.listItem}>
            <TouchableOpacity>
              <Image style={[styles.img, { width: 80 }]} source={{ uri: baseUrl342 + file_path }} />
            </TouchableOpacity>
          </View>
        )
      case "IMGwide":
        return (
          <View style={styles.listItem}>
            <TouchableOpacity>
              <Image style={[styles.img, { width: 220 }]} source={{ uri: baseUrl342 + file_path }} />
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
  img: {
    height: 120,
    borderRadius: 10,
    marginBottom:10
  }
});