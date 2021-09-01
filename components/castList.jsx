
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React, { Component } from 'react';


const getCastInfo = "https://api.themoviedb.org/3/movie/588228/credits?api_key=648d096ec16e3f691572593e44644d30&language=en-US"
const baseImageLink = "https://image.tmdb.org/t/p/w500"

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
          dim.height = 130
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


  moveToMovie = async (name) => {
    console.log(name.name + ", " + name.id)
    //this.props.navigation.push("Cast", { jsonObject: movie })
  }

  rowRenderer = (type, data) => {
    const { name, profile_path, character } = data.item;
    return (

      <View style={styles.listItem}>
        <TouchableOpacity style={styles.imageTouch} onPress={() => { this.moveToMovie(data.item) }}>
          <View>
            <Text>Name: {name}</Text>
            <Text>Character: {character}</Text>

          </View>
          <Image style={{ height: "100%", width: "100%" }} source={{ uri: baseImageLink + profile_path }} />
        </TouchableOpacity>
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
          renderFooter={() => { return (<Text onLayout={this.props.footerPos} style={{ color: "#fff", textAlign: "center" }}>loading...</Text>) }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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