import { StyleSheet, View, ScrollView } from 'react-native';

import Colors from '../src/style';
import React from 'react';
import { TopBar } from '../components/topBar';

import { FontText } from '../components/fontText';
import MovieListScroll from '../components/MovieListScroll';
import MovieListVerticalScroll from '../components/MovieListVerticalScroll';


const NowPlaying = ({navigation}) => {
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>Now playing</FontText>
      </View>
      <View style={{ height: 200 }}>
        <MovieListScroll id={"nowPlaying"} navigation={navigation} />
      </View>
    </View>
  )
}

const UpComing = ({navigation}) => {
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>Up coming</FontText>
      </View>
      <View style={{ height: 200 }}>
        <MovieListScroll id={"upComing"} navigation={navigation} />
      </View>
    </View>
  )
}

const TopRated = ({navigation}) => {
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>Top rated</FontText>
      </View>
      <View style={{ height: 200 }}>
      <MovieListScroll id={"topRated"} navigation={navigation} />
      </View>
    </View>
  )
}


const Home = ({ navigation }) => {

  return (
    <View style={styles.container}>

      <TopBar navigation={navigation} />



      <MovieListVerticalScroll id={"popular"} navigation={navigation} component={[NowPlaying, UpComing, TopRated]} />



      {/* <ScrollView>


        <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
          <FontText fontSize={20} font={"Roboto-Bold"}>Now playing</FontText>
        </View>
        <View style={{ height: 200 }}>
          <MovieListScroll id={"nowPlaying"} navigation={navigation} />
        </View>

        <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
          <FontText fontSize={20} font={"Roboto-Bold"}>Up coming</FontText>
        </View>
        <View style={{ height: 200 }}>
          <MovieListScroll id={"upComing"} navigation={navigation} />
        </View>

        <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
          <FontText fontSize={20} font={"Roboto-Bold"}>Top rated</FontText>
        </View>
        <View style={{ height: 200 }}>
          <MovieListScroll id={"topRated"} navigation={navigation} />
        </View>



      </ScrollView> */}






    </View>
  );
}

export { Home }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
  mainMenu: {
    backgroundColor: Colors.mainColor,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,

  },
  menuHamburger: {
    margin: 10
  },
  menuLogo: {

  },
  menuSearch: {
    margin: 10
  }
});