import { StyleSheet, View, TouchableOpacity, Text, Animated, Image, Share } from "react-native";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

import { baseUrl500, baseUrl780, baseUrlOri, descriptionFix, getSeasonDetails, reFormatData } from "../src/helper";
import { FontText } from "../components/fontText";
import Colors from "../src/style";
import EpisodeScroll from "../components/scrollView/EpisodeScroll";

//https://api.themoviedb.org/3/tv/60625/season/1?api_key=648d096ec16e3f691572593e44644d30&language=en-US

const HEADER_MAX_HEIGHT = 500;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface SeasonViewerProps {
  navigation: any;
  route: any;
}

const SeasonViewer: React.FC<SeasonViewerProps> = ({ navigation, route }) => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const [toggleDisc, setToggleDisc] = useState(false);
  const [description, setDescription] = useState("");
  const descriptionText = descriptionFix(description, toggleDisc);

  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const data = await getSeasonDetails(route.params.tv_id, route.params.data.season_number);
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
      <Animated.Image style={[styles.mainImg, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: baseUrlOri + data.poster_path }} />

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

          <View>
            <View style={{ marginLeft: "4%", marginTop: 30, marginBottom: 5 }}>
              <FontText fontSize={20} font={"Roboto-Bold"}>
                Episodes
              </FontText>
            </View>
            <View style={{ flex: 1, marginLeft: "4%" }}>
              <EpisodeScroll
                episodes={data.episodes}
                navigation={navigation}
                fall_back={route.params.fall_back}
                tv_id={route.params.tv_id}
                season_number={route.params.data.season_number}
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
  description: {
    marginTop: 29,
  },
});

export { SeasonViewer };
