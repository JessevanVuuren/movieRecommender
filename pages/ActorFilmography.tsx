import { StyleSheet, View, TouchableOpacity, Text, Animated } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import CollectionScroll from "../components/scrollView/CollectionScroll";
import { base_url_342, base_url_ori, get_collection_data, get_filmography } from "../src/fetcher";
import React, { useState, useRef, useEffect } from "react";
import { Collection, Part } from "../models/collection";
import { LinearGradient } from "expo-linear-gradient";
import { FontText } from "../components/fontText";
import { descriptionFix } from "../src/helper";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Colors from "../src/style";
import { TopBar } from "../components/topBar";
import FilmographyScroll from "../components/scrollView/FilmographyScroll";
import { FilmographyCast } from "../models/filmography";
import MovieOrSeries from "../components/MovieOrSeries";
import { useGlobalState } from "../global/state";
import ShowTypeSwitch from "../components/ShowTypeSwitch";

const ActorFilmography = ({ route, navigation }) => {
  const [sortedList, setSortedList] = useState<FilmographyCast[]>([]);
  const [showType, setShowType] = useState("movie")

  const set_data = async () => {
    const list = await get_filmography(route.params.actor_id, showType);

    
    list.sort((a, b) => {
      if (showType == "movie") return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      return new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime()
    });
    
    const filtered = list.filter(e => e.backdrop_path && e.poster_path)

    setSortedList(filtered);
  };

  useEffect(() => { set_data() }, []);
  useEffect(() => { set_data() }, [showType]);



  if (!sortedList) return;

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} hambAction={"goBack"} />

      <View style={{marginBottom:5}}>
        <ShowTypeSwitch set_type={(show_type) => setShowType(show_type)} />
      </View>



      <FilmographyScroll navigation={navigation} list={sortedList} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});

export { ActorFilmography };
