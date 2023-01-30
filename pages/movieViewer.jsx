import { baseUrl500, descriptionFix, getDate, genreMovieDict, getStreamProviders, baseUrlOri, getMasterDetails } from "../src/helper";
import { StyleSheet, View, TouchableOpacity, Text, Animated, Image, Share, ScrollView } from "react-native";
import { saveMovieToWatchList, ifMovieAdded, removeMovie } from "../src/saveLoadWatchList";
import VideoPlayerScroll from "../components/scrollView/videoPlayerScroll";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import MovieListScroll from "../components/scrollView/MovieListScroll";
import CastListScroll from "../components/scrollView/castListScroll";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { FontText } from "../components/fontText";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import Colors from "../src/style";

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const Movie = ({ route, navigation }) => {
  const [object] = useState(route.params.jsonObject);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [toggleDisc, setToggleDisc] = useState(false);
  const descriptionText = descriptionFix(object.overview, toggleDisc);

  const [InWatchList, setInWatchList] = useState(false);
  const [masterData, setMasterData] = useState(null);
  const [providers, setProviders] = useState({});

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  useEffect(() => {
    checkMovie();
    (async () => {
      setMasterData(await getMasterDetails("movie", object.id));
      setProviders(await getStreamProviders(object.id, "movie"));
    })();
  }, []);

  const addRemoveMovie = async (movie) => {
    if (!InWatchList) await saveMovieToWatchList(movie);
    else await removeMovie(movie);
    checkMovie();
  };

  const checkMovie = async () => {
    setInWatchList(await ifMovieAdded(object.id));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons style={styles.backArrow} name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Animated.Image
        style={[styles.mainImg, { transform: [{ translateY: imageTranslateY }] }]}
        source={{ uri: baseUrl500 + object.backdrop_path }}
      />

      <Animated.ScrollView
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(3, 7, 30,1)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, height: 80, width: "100%", marginTop: -80 }}
        />
        <View style={{ backgroundColor: Colors.background }}>
          <AutoSizeText fontSize={43} numberOfLines={1} style={styles.titleText} mode={ResizeTextMode.max_lines}>
            {object.title}
          </AutoSizeText>
          <View style={styles.scrollContainer}>
            <View style={styles.addButton}>
              <Text style={styles.releaseDate}>{getDate(object.release_date)}</Text>

              <View style={styles.movieRatingRow}>
                <Image source={require("../assets/star-symbol.png")} style={[styles.topStar, { height: 15.5, width: 16 }]} />
                <Text style={styles.voteAverage}>{object.vote_average}</Text>
              </View>

              <View style={{ alignItems: "flex-end", flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => addRemoveMovie(masterData)}>
                    {!InWatchList ? (
                      <MaterialIcons name="playlist-add" size={27} color="white" />
                    ) : (
                      <MaterialIcons name="playlist-add" size={27} color={Colors.mainColor} />
                    )}
                  </TouchableOpacity>

                  {/* <TouchableOpacity onPress={share}>
                    <Image source={require("../assets/share.png")} style={[styles.topButtons, { height: 20, width: 24 }]} />
                  </TouchableOpacity> */}
                </View>
              </View>
            </View>

            <View>
              <View style={{ marginTop: 29 }}>
                <FontText font={"Roboto-Bold"} fontSize={20}>
                  Description
                </FontText>
              </View>
              <FontText font={"Roboto-Regular"} fontSize={14}>
                {descriptionText.text}
                {descriptionText.shortened && (
                  <Text onPress={() => setToggleDisc(!toggleDisc)} style={{ color: Colors.mainColor }}>
                    {!toggleDisc ? " More" : " Less"}
                  </Text>
                )}
              </FontText>
            </View>

            {masterData && masterData.genres && (
              <View>
                <View style={{ marginTop: 29 }}>
                  <FontText fontSize={20} font={"Roboto-Bold"}>
                    Genres
                  </FontText>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {masterData.genres.map((genreID, key) => {
                    return (
                      <View key={key} style={styles.genresView}>
                        <FontText fontSize={15} font={"Roboto-Regular"}>
                          {genreMovieDict[genreID.id]}
                        </FontText>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            <View>
              {providers && providers.data && (
                <View>
                  <View style={{ marginTop: 29, marginBottom: 5 }}>
                    <FontText fontSize={20} font={"Roboto-Bold"}>
                      Where to watch
                    </FontText>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <ScrollView horizontal={true}>
                      {providers.data.map((provider) => {
                        return (
                          <Image
                            key={provider.provider_id}
                            style={{ height: 40, width: 40, marginRight: 10, borderRadius: 9 }}
                            source={{ uri: baseUrlOri + provider.logo_path }}
                          />
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              )}
            </View>
          </View>

          {masterData && masterData.videos && (
            <View>
              <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
                <FontText fontSize={20} font={"Roboto-Bold"}>
                  Trailer's & Video's
                </FontText>
              </View>
              <View style={{ flex: 1, height: 120 }}>
                <VideoPlayerScroll id="video" showType={"movie"} master_data={masterData.videos} />
              </View>
            </View>
          )}

          {masterData && masterData.credits && (
            <View>
              <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
                <FontText fontSize={20} font={"Roboto-Bold"}>
                  Cast
                </FontText>
              </View>
              <View style={{ flex: 1, height: 200 }}>
                <CastListScroll showType={"movie"} navigation={navigation} master_data={masterData.credits} />
              </View>
            </View>
          )}

          {masterData && masterData.recommendations && (
            <View>
              <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
                <FontText fontSize={20} font={"Roboto-Bold"}>
                  Matching movies
                </FontText>
              </View>
              <View style={{ flex: 1, height: 250 }}>
                <MovieListScroll showType={"movie"} master_data={masterData.recommendations} navigation={navigation} />
              </View>
            </View>
          )}
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
    marginRight: "6%",
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
