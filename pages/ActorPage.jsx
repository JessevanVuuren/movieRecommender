import { StyleSheet, View, TouchableOpacity, Text, Animated, Image, Share } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons"

import { baseUrl500, reFormatData, descriptionFix, getActorDetails } from "../src/helper";
import MovieListScroll from "../components/scrollView/MovieListScroll";
import { FontText } from "../components/fontText";
import Colors from "../src/style";

const HEADER_MAX_HEIGHT = 450;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ActorPage = ({ route, navigation }) => {
  const [data, setData] = useState(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const [toggleDisc, setToggleDisc] = useState(false);
  const [biography, setBiography] = useState("");
  const descriptionText = descriptionFix(biography, toggleDisc);

  useEffect(() => {
    (async () => {
      const json = await getActorDetails(route.params.ActorObject.id);
      setData(json);
      setBiography(json.biography);
    })();
  }, []);

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  if (!data) return;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons style={styles.backArrow} name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Animated.Image style={[styles.mainImg, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: baseUrl500 + data.profile_path }} />

      <Animated.ScrollView scrollEventThrottle={16} contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
        <LinearGradient colors={["rgba(255,255,255,0)", "rgba(3, 7, 30,1)"]} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, height: 80, width: "100%", marginTop: -80 }} />

        <View style={{ backgroundColor: Colors.background }}>
          <AutoSizeText fontSize={43} numberOfLines={1} style={styles.titleText} mode={ResizeTextMode.max_lines}>
            {data.name}
          </AutoSizeText>
          <View style={styles.scrollContainer}>
            <View style={styles.addButton}>
              <Text style={styles.releaseDate}>
                {reFormatData(data.birthday)}
                {data.deathday && " - " + reFormatData(data.deathday)}
              </Text>

              <View style={{ alignItems: "flex-end", flex: 1 }}>
                <View style={{ flexDirection: "row" }}></View>
              </View>
            </View>

            <View style={{ marginTop: 29 }}>
              <FontText font={"Roboto-Bold"} fontSize={20}>
                Biography
              </FontText>
            </View>
            <FontText font={"Roboto-Regular"} fontSize={14}>
              {descriptionText.text}{" "}
              {descriptionText.shortened && (
                <Text onPress={() => setToggleDisc(!toggleDisc)} style={{ color: Colors.mainColor }}>
                  {!toggleDisc ? " More" : " Less"}
                </Text>
              )}
            </FontText>
          </View>

          <TouchableOpacity onPress={() => navigation.push("ActorFilmography", {actor_id: data.id})} style={{ marginLeft: "4%", marginTop: 30, marginBottom: 10, flexDirection:"row" }}>
            <FontText fontSize={20} font={"Roboto-Bold"}>
              Filmography
            </FontText>
            <View style={{ marginTop: 4, backgroundColor: Colors.background_highlight, borderRadius: 3, marginLeft: 10 }}>
              <MaterialIcons name="keyboard-arrow-right" size={24} color={Colors.textColor} />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, height: 250 }}>
            <MovieListScroll showType={"movie"} id={"actorMovieList"} navigation={navigation} actorID={data.id} />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  backButton: {
    width: 40,
    zIndex: 10,
    height: 40,
    marginLeft: 15,
    borderRadius: 25,
    position: "absolute",
    backgroundColor: "#FFFFFF50",
    marginTop: 15 + Constants.statusBarHeight,
  },
  backArrow: {
    marginLeft: 8,
    marginTop: 6.7,
  },
  titleText: {
    marginTop: -10,
    color: Colors.textColor,
    textAlign: "center",
  },
  mainImg: {
    top: 0,
    left: 0,
    right: 0,
    resizeMode: "cover",
    position: "absolute",
    height: HEADER_MAX_HEIGHT,
  },
  scrollContainer: {
    width: "92%",
    alignSelf: "center",
  },

  releaseDate: {
    color: Colors.mainColor,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  movieRatingRow: {
    flexDirection: "row",
  },

  voteAverage: {
    color: Colors.textColor,
    fontSize: 16,
    marginTop: 5,
  },
  topStar: {
    marginTop: 8,
    marginRight: 5,
    marginLeft: "20%",
  },

  addButton: {
    flexDirection: "row",
  },
  topButtons: {
    marginTop: 8,
    marginHorizontal: 10,
  },

  description: {
    marginTop: 29,
  },
  genresView: {
    backgroundColor: Colors.darkLight,
    marginRight: 14,
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 25,
  },
});

export { ActorPage };
