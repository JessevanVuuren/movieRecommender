import { StyleSheet, View, BackHandler, Alert } from 'react-native'
import * as Linking from "expo-linking"
import React, { useEffect, useState, useRef } from 'react'

import MovieListVerticalScroll from '../components/scrollView/MovieListVerticalScroll'
import MovieListScroll from '../components/scrollView/MovieListScroll'
import { FontText } from '../components/fontText'
import { TopBar } from '../components/topBar'
import { infoUrl } from '../src/helper'
import Colors from '../src/style'

const prefix = Linking.makeUrl("/");

const NowPlaying = ({ navigation }) => {
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

const UpComing = ({ navigation }) => {
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

const TopRated = ({ navigation }) => {
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


const Home = ({ route, navigation }) => {
  const isScreenMounted = useRef(true)
  const URL = Linking.useURL() || "noUrl"


  useEffect(() => {
    if (!isScreenMounted.current) return;
    const getMovieData = async () => {
        console.log("URL: " + URL)
        let cleanURL = Linking.parse(URL)
        if (cleanURL.queryParams.id !== undefined) {
          const getMovies = await fetch(infoUrl[0] + cleanURL.queryParams.id + infoUrl[1])
          const json = await getMovies.json()
          json["genre_ids"] = json["genres"].map((genre) => genre.id)
          navigation.push("MovieScreen", { jsonObject: json })
        } else {
          console.log("no url params")
        }
      
    }
    getMovieData(URL)
  }, [URL])




  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} hambAction={"openD"} />
      <MovieListVerticalScroll id={"popular"} navigation={navigation} component={[NowPlaying, UpComing, TopRated]}/>
    </View>
  );
}

export { Home }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
});