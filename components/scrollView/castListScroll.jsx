
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import React from 'react';

import { getCast, baseUrl342 } from "../../src/helper"
import { FontText } from '../fontText';
import Colors from '../../src/style';


export default class CastListScroll extends React.Component {

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
          dim.width = 100 + (Dimensions.get('window').width * 0.04);
          dim.height = 150
          break;
      };
    })
  }

  componentDidMount = async () => {

    console.log("Get cast list: " + getCast[0] + this.props.id + getCast[1])
    const getMovies = await fetch(getCast[0] + this.props.id + getCast[1])
    const json = await getMovies.json()

    const fullList = []
    for (let i = 0; i < json.cast.length; i++) {
      if (json.cast[i].profile_path != null){
        fullList.push({
          type: "NORMAL", 
          item: json.cast[i]
        })
      }
    }


    this.setState({
      list: this.state.list.cloneWithRows( fullList),
      doneLoading: true
    })
  }

  goToActor = async (ActorObject) => {
    console.log("Go to: " + ActorObject.name + " - " + ActorObject.id)
    this.props.navigation.push("ActorPage", { ActorObject: ActorObject })
  }

  rowRenderer = (type, data) => {
    const { profile_path, name } = data.item;
    return (

      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => this.goToActor(data.item)}>
          <Image style={styles.img} source={{ uri: baseUrl342 + profile_path }} />
          <FontText font={"Roboto-Bold"} fontSize={14}>{name}</FontText>

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


  img: {
    height: 150,
    width: 100,
    borderRadius: 10,
    marginBottom:10
  }

});