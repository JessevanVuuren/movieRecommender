import { StyleSheet, View, TouchableOpacity, Text, Animated, Image, Share, ScrollView } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

import { baseUrl500, descriptionFix, getDate, genreDict, whereToWatch, baseUrlOri, baseUrl342 } from "../src/helper";
import { saveMovieToWatchList, ifMovieAdded, removeMovie } from "../src/saveLoadWatchList";
import VideoPlayerScroll from "../components/scrollView/videoPlayerScroll";
import MovieListScroll from "../components/scrollView/MovieListScroll";
import CastListScroll from "../components/scrollView/castListScroll";
import { FontText } from "../components/fontText";
import Colors from "../src/style";

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Movie = ({ route, navigation }) => {
  const [object] = useState(route.params.jsonObject);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [toggleDisc, setToggleDisc] = useState(false);
  const descriptionText = descriptionFix(object.overview, toggleDisc);

  const [isCast, setIsCast] = useState(true);
  const [isVideo, setIsVideo] = useState(true);

  const [providers, setProviders] = useState({});

  const [showRecommendations, setShowRecommendations] = useState(true);

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  useEffect(() => {
    checkMovie();
    getStreamProviders();
  }, []);

  const getStreamProviders = async () => {
    console.log("Get provider: " + whereToWatch[0] + object.id + whereToWatch[1]);
    const data = await fetch(whereToWatch[0] + object.id + whereToWatch[1]);
    const json = await data.json();
    if (json.results.US) {
      const fullArray = { data: [] };
      const pro = json.results.US;
      const nameAlreadyIn = [];

      if (pro.buy) {
        for (let i = 0; i < pro.buy.length; i++) {
          let provider = pro.buy[i];
          nameAlreadyIn.push(provider.provider_name);
          fullArray["data"].push(provider);
        }
      }

      if (pro.rent) {
        for (let i = 0; i < pro.rent.length; i++) {
          let provider = pro.rent[i];
          if (!nameAlreadyIn.includes(provider.provider_name)) {
            nameAlreadyIn.push(provider.provider_name);
            fullArray["data"].push(provider);
          }
        }
      }
      if (pro.flatrate) {
        for (let i = 0; i < pro.flatrate.length; i++) {
          let provider = pro.flatrate[i];
          if (!nameAlreadyIn.includes(provider.provider_name)) {
            fullArray["data"].push(provider);
          }
        }
      }

      setProviders(fullArray);
    }
  };

  const share = async () => {
    await Share.share({ message: "Have you seen " + object.title + " yet?\n\nhttps://movierecommender.ga/movie?id=" + object.id });
  };

  const addRemoveMovie = async (movie) => {
    if (!InWatchList) await saveMovieToWatchList(movie);
    else await removeMovie(movie);
    checkMovie();
  };

  const checkMovie = async () => {
    setInWatchList(await ifMovieAdded(object.id));
  };
  const [InWatchList, setInWatchList] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons style={styles.backArrow} name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Animated.Image style={[styles.mainImg, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: baseUrl500 + object.backdrop_path }} />

      <Animated.ScrollView scrollEventThrottle={16} contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
        <LinearGradient colors={["rgba(255,255,255,0)", "rgba(3, 7, 30,1)"]} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, height: 80, width: "100%", marginTop: -80 }} />
        <View style={{ backgroundColor: Colors.background }}>
          <AutoSizeText fontSize={43} numberOfLines={1} style={styles.titleText} mode={ResizeTextMode.max_lines}>
            {" "}
            {object.title}{" "}
          </AutoSizeText>
          <View style={styles.scrollContainer}>
            <View style={styles.addButton}>
              <Text style={styles.releaseDate}>{getDate(object)}</Text>

              <View style={styles.movieRatingRow}>
                <Image source={require("../assets/star-symbol.png")} style={[styles.topStar, { height: 15.5, width: 16 }]} />
                <Text style={styles.voteAverage}>{object.vote_average}</Text>
              </View>

              <View style={{ alignItems: "flex-end", flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => addRemoveMovie(object)}>{!InWatchList ? <Image source={require("../assets/addToWatchList.png")} style={[styles.topButtons, { height: 20.5, width: 21 }]} /> : <Image source={require("../assets/WatchListCheck.png")} style={[styles.topButtons, { height: 20.5, width: 21 }]} />}</TouchableOpacity>

                  <TouchableOpacity onPress={share}>
                    <Image source={require("../assets/share.png")} style={[styles.topButtons, { height: 20, width: 24 }]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* description */}
            <View>
              <View style={{ marginTop: 29 }}>
                <FontText font={"Roboto-Bold"} fontSize={20}>
                  Description
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

            {/* Genres */}
            <View>
              <View style={{ marginTop: 29 }}>
                <FontText fontSize={20} font={"Roboto-Bold"}>
                  Genres
                </FontText>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {object.genre_ids.map((genreID, key) => {
                  return (
                    <View key={key} style={styles.genresView}>
                      <FontText fontSize={15} font={"Roboto-Regular"}>
                        {genreDict[genreID]}
                      </FontText>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* watch here */}
            <View>
              {providers.data && (
                <View>
                  <View style={{ marginTop: 29, marginBottom: 5 }}>
                    <FontText fontSize={20} font={"Roboto-Bold"}>
                      Where to watch
                    </FontText>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <ScrollView horizontal={true}>
                      {providers.data.map((provider) => {
                        return <Image key={provider.provider_id} style={{ height: 40, width: 40, marginRight: 10, borderRadius: 9 }} source={{ uri: baseUrlOri + provider.logo_path }} />;
                      })}
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Trailer's and Video's */}
          {isVideo && (
            <View>
              <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
                <FontText fontSize={20} font={"Roboto-Bold"}>
                  Trailer's & Video's
                </FontText>
              </View>
              <View style={{ flex: 1, height: 120 }}>
                <VideoPlayerScroll id={object.id} isEmpty={() => setIsVideo(false)} />
              </View>
            </View>
          )}
          {/* Cast */}
          {isCast && (
            <View>
              <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
                <FontText fontSize={20} font={"Roboto-Bold"}>
                  Cast
                </FontText>
              </View>
              <View style={{ flex: 1, height: 200 }}>
                <CastListScroll id={object.id} navigation={navigation} isEmpty={() => setIsCast(false)} />
              </View>
            </View>
          )}

          {/* Matching Movie's */}
          <View style={{ display: showRecommendations ? "flex" : "none" }}>
            <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
              <FontText fontSize={20} font={"Roboto-Bold"}>
                Matching movie's
              </FontText>
            </View>
            <View style={{ flex: 1, height: 250 }}>
              <MovieListScroll
                id={object.id}
                navigation={navigation}
                listLength={(e) => {
                  e == 0 ? setShowRecommendations(false) : setShowRecommendations(true);
                }}
              />
            </View>
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

export { Movie };
