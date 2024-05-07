import { StyleSheet, View, TouchableOpacity, Text, Animated, Image, Share } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

import { baseUrlOri, descriptionFix, getEpisodeDetails, getDate } from "../src/helper";
import { FontText } from "../components/fontText";
import Colors from "../src/style";
import EpisodeScroll from "../components/scrollView/EpisodeScroll";
import VideoPlayerScroll from "../components/scrollView/videoPlayerScroll";
import CastListScroll from "../components/scrollView/castListScroll";

//https://api.themoviedb.org/3/tv/100088/season/1/episode/1?api_key=648d096ec16e3f691572593e44644d30&language=en-US&append_to_response=videos,images,credits

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface EpisodeViewerProps {
  navigation: any;
  route: any;
}

const EpisodeViewer: React.FC<EpisodeViewerProps> = ({ navigation, route }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const [toggleDisc, setToggleDisc] = useState(false);
  const [description, setDescription] = useState("");
  const descriptionText = descriptionFix(description, toggleDisc);

  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getEpisodeDetails(route.params.tv_id, route.params.season_number, route.params.data.episode_number);
      setData(data);
      setDescription(data.overview);
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
      <Animated.Image style={[styles.mainImg, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: baseUrlOri + data.still_path }} />

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
            {data.name}
          </AutoSizeText>
          <View style={styles.scrollContainer}>

            <View style={styles.addButton}>
              <Text style={styles.releaseDate}>{getDate(data.air_date)}</Text>

              <View style={styles.movieRatingRow}>
                <Image source={require("../assets/star-symbol.png")} style={[styles.topStar, { height: 15.5, width: 16 }]} />
                <Text style={styles.voteAverage}>{data.vote_average}</Text>
              </View>


            </View>



            {description && (
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
            )}
          </View>

          {data?.videos?.results > 0 && (
            <View>
              <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
                <FontText fontSize={20} font={"Roboto-Bold"}>
                  Trailer's & Video's
                </FontText>
              </View>
              <View style={{ flex: 1, height: 120 }}>
                <VideoPlayerScroll id="video" showType={"movie"} master_data={data.videos} />
              </View>
            </View>
          )}

          {data && data.credits && (
            <View>
              <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
                <FontText fontSize={20} font={"Roboto-Bold"}>
                  Cast
                </FontText>
              </View>
              <View style={{ flex: 1, height: 200 }}>
                <CastListScroll showType={"movie"} navigation={navigation} master_data={data.credits} />
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
  addButton: {
    flexDirection: "row",
  },
  releaseDate: {
    color: Colors.mainColor,
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
    marginRight: "6%",
  },
  voteAverage: {
    color: Colors.textColor,
    fontSize: 16,
    marginTop: 5,
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
  topStar: {
    marginTop: 8,
    marginRight: 5,
  },

  movieRatingRow: {
    flexDirection: "row",
  },
  description: {
    marginTop: 29,
  },
});

export { EpisodeViewer };
