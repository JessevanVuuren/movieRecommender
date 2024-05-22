import { StyleSheet, View, TouchableOpacity, Text, Animated } from "react-native"
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text"
import CollectionScroll from "../components/scrollView/CollectionScroll"
import { base_url_342, get_collection_data } from "../src/fetcher"
import React, { useState, useRef, useEffect } from "react"
import { Collection, Part } from "../models/collection"
import { LinearGradient } from "expo-linear-gradient"
import { FontText } from "../components/fontText"
import { descriptionFix } from "../src/helper"
import { Ionicons } from "@expo/vector-icons"
import Constants from "expo-constants"
import Colors from "../src/style"

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const CollectionViewer = ({ route, navigation }) => {
  const [overview, setOverview] = useState<{ text: any, shortened: boolean }>({ text: "", shortened: false })
  const [collection, setCollection] = useState<Collection>();
  const [sortedList, setSortedList] = useState<Part[]>([]);  
  const [toggleDisc, setToggleDisc] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -100],
    extrapolate: "clamp",
  });

  const sort_list = (list:Part[]) => {
    list.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
    setSortedList(list)
  }

  useEffect(() => {
    (async () => {
      const data = await get_collection_data(route.params.collection_id)
      sort_list(data.parts)
      setCollection(data)
      setOverview(descriptionFix(data.overview, toggleDisc))

    })();
  }, []);

  if (!collection) return

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons style={styles.backArrow} name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Animated.Image style={[styles.mainImg, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: base_url_342 + collection.backdrop_path }} />

      <Animated.ScrollView scrollEventThrottle={16} contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}>
        <LinearGradient colors={["rgba(255,255,255,0)", "rgba(3, 7, 30,1)"]} start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, height: 80, width: "100%", marginTop: -80 }} />
        <View style={{ backgroundColor: Colors.background }}>
          <AutoSizeText fontSize={43} numberOfLines={1} style={styles.titleText} mode={ResizeTextMode.max_lines}>
            {collection.name}
          </AutoSizeText>
          <View style={styles.scrollContainer}>
            <View>
              <View style={{ marginTop: 29 }}>
                <FontText font={"Roboto-Bold"} fontSize={20}>
                  Overview
                </FontText>
              </View>
              <FontText font={"Roboto-Regular"} fontSize={14}>
                {overview.text}
                {overview.shortened && (
                  <Text onPress={() => { setOverview(descriptionFix(collection.overview, !toggleDisc)); setToggleDisc(!toggleDisc) }} style={{ color: Colors.mainColor }}>
                    {!toggleDisc ? " More" : " Less"}
                  </Text>
                )}
              </FontText>
            </View>
          </View>

          <View style={{ flex: 1, width: "100%", marginTop:30 }}>
            <CollectionScroll list={sortedList} navigation={navigation} />
          </View>

        </View>
      </Animated.ScrollView >
    </View >
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

});

export { CollectionViewer };
