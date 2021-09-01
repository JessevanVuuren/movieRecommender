
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React, { Component } from 'react';


const getCastInfo = "https://api.themoviedb.org/3/movie/588228/credits?api_key=648d096ec16e3f691572593e44644d30&language=en-US"

export default class MovieList extends React.Component {

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
          dim.height = 100
          break;
      };
    })
  }

  componentDidMount() {
    fetch(getCastInfo)
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
  }


  moveToMovie = async (movie) => {
    console.log(movie.title + ", " + movie.id)
    this.props.navigation.push("Movie", { jsonObject: movie })
  }

  rowRenderer = (type, data) => {
    const { name } = data.item;
    return (

      <View style={styles.listItem}>
        <Text>Name: { name }</Text>
        {/* <TouchableOpacity style={styles.imageTouch} onPress={() => { this.moveToMovie(movieOne) }}>
          <Image style={{ height: "100%", width: "100%" }} source={{ uri: baseImageLink + movieOne.poster_path }} />
        </TouchableOpacity> */}
      </View>
    )
  }

  render() {
    if (this.state.list.length <= 0) return null
    return (
      <View style={styles.container} >
        <RecyclerListView
          style={{ flex: 1 }}
          rowRenderer={this.rowRenderer}
          dataProvider={this.state.list}
          layoutProvider={this.layoutProvider}
          renderFooter={() => { return ( <Text onLayout={this.props.footerPos} style={{color:"#fff", textAlign:"center"}}>loading...</Text> ) }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  listItem: {
    width:"100%"


  },
});