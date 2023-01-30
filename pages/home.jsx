import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import * as Linking from "expo-linking";

import MovieListVerticalScroll from "../components/scrollView/MovieListVerticalScroll";
import MovieListScroll from "../components/scrollView/MovieListScroll";
import MovieOrSeries from "../components/MovieOrSeries";
import { FontText } from "../components/fontText";
import { useGlobalState } from "../global/state";
import Skeleton from "../components/Skeleton";
import { TopBar } from "../components/topBar";
import { infoUrl } from "../src/helper";
import Colors from "../src/style";

const NowPlaying = ({ navigation, showType }) => {
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 10, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>
          Now playing
        </FontText>
      </View>
      <View style={{ height: 220 }}>
        <MovieListScroll id={"nowPlaying"} showType={showType} navigation={navigation} />
      </View>
    </View>
  );
};

const UpComing = ({ navigation, showType }) => {
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 10, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>
          Up coming
        </FontText>
      </View>
      <View style={{ height: 220 }}>
        <MovieListScroll id={"upComing"} showType={showType} navigation={navigation} />
      </View>
    </View>
  );
};

const TopRated = ({ navigation, showType }) => {
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 10, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>
          Top rated
        </FontText>
      </View>
      <View style={{ height: 220 }}>
        <MovieListScroll id={"topRated"} showType={showType} navigation={navigation} />
      </View>
    </View>
  );
};

const Home = ({ route, navigation }) => {
  const [showType] = useGlobalState("showType");
  const isScreenMounted = useRef(true);
  const URL = Linking.useURL() || "noUrl";

  useEffect(() => {
    if (!isScreenMounted.current) return;
    const getMovieData = async () => {
      let cleanURL = Linking.parse(URL);
      if (cleanURL.queryParams.id !== undefined) {
        const getMovies = await fetch(infoUrl[0] + cleanURL.queryParams.id + infoUrl[1]);
        const json = await getMovies.json();
        json["genre_ids"] = json["genres"].map((genre) => genre.id);
        navigation.push("MovieScreen", { jsonObject: json });
      }
    };
    getMovieData(URL);
  }, [URL]);

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} hambAction={"openD"} />
      <MovieOrSeries />
      {/* <MovieListVerticalScroll id={"popular"} navigation={navigation} showType={showType} component={[NowPlaying, UpComing, TopRated]} key={showType} /> */}
      <MovieListVerticalScroll id={"popular"} navigation={navigation} showType={showType} component={[]} key={showType} />
    </View>
  );
};

export { Home };

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});
