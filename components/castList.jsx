
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React, { Component } from 'react';
import Colors from '../src/style';

const getCastInfo = ["https://api.themoviedb.org/3/movie/", "/credits?api_key=" + EXPO_API_URL + "&language=en-US"]
const baseImageLink = "https://image.tmdb.org/t/p/w342"

export default class MovieList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      list: new DataProvider((r1, r2) => r1 !== r2),
      doneLoading: false,
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

  componentDidMount() {
    this.setState({doneLoading:false})
    fetch(getCastInfo[0] + this.props.id + getCastInfo[1])
      .then((res) => res.json())
      .then((data) => {
        let dataList = []

        for (let i = 0; i < data.cast.length; i++) {
          dataList.push({
            type: "NORMAL",
            item: data.cast[i]
          })
        }

        this.setState({
          list: this.state.list.cloneWithRows(dataList),
        })
      })
      .catch((error) => alert(error))
      .finally(() => {this.setState({doneLoading:true})})
  }


  moveToMovie = async (name) => {
    console.log(name.name + ", " + name.id)
    //this.props.navigation.push("Cast", { jsonObject: movie })
  }

  rowRenderer = (type, data) => {
    const { name, profile_path, character } = data.item;
    return (

      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => { this.moveToMovie(data.item) }}>
          <Image style={{ height: 130, width: 90 }} source={{ uri: baseImageLink + profile_path }} />
          <View style={styles.textView}>
            <Text style={[styles.castName, {color:Colors.textColor}]}>{name}</Text>
            <Text style={[styles.castName, {color:Colors.mainColor}]}>{character}</Text>

          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if(!this.state.doneLoading) return null
    return (
      <View style={styles.container} >
        <RecyclerListView
          style={{ flex: 1 }}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.list}
          layoutProvider={this.layoutProvider}
          renderFooter={() => { return (<Text onLayout={this.props.footerPos} style={{ color: Colors.textColor, textAlign: "center" }}>loading...</Text>) }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  castName:{
    fontSize: 17,
    fontWeight:"bold"
  },
  textView:{
    position:"absolute",
    marginLeft:100
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