import MovieListVerticalScroll from "../components/scrollView/MovieListVerticalScroll"
import MovieListScroll from "../components/scrollView/MovieListScroll"
import CarouselBanner from "../components/scrollView/CarouselBanner"
import { getAllMovies, migrateDatabase, saveMovieToWatchList } from "../src/saveLoadWatchList"
import { getValue, setValue } from "../src/LocalStorage"
import MovieOrSeries from "../components/MovieOrSeries"
import React, { useEffect, useState } from "react"
import { FontText } from "../components/fontText"
import { useGlobalState } from "../global/state"
import Disclaimer from "../components/Disclamer"
import { StyleSheet, View } from "react-native"
import { TopBar } from "../components/topBar"
import * as DB from "../src/watchListSQL"
import Colors from "../src/style"

const NowPlaying = ({ navigation }) => {
  const [showType] = useGlobalState("showType");
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 10, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>
          Now playing
        </FontText>
      </View>
      <View style={{ height: 220 }}>
        <MovieListScroll id={"nowPlaying"} showType={showType} navigation={navigation} key={showType} />
      </View>
    </View>
  );
};

const UpComing = ({ navigation }) => {
  const [showType] = useGlobalState("showType");
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 10, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>
          Up coming
        </FontText>
      </View>
      <View style={{ height: 220 }}>
        <MovieListScroll id={"upComing"} showType={showType} navigation={navigation} key={showType} />
      </View>
    </View>
  );
};

const TopRated = ({ navigation }) => {
  const [showType] = useGlobalState("showType");
  return (
    <View>
      <View style={{ marginLeft: "4%", marginTop: 10, marginBottom: 10 }}>
        <FontText fontSize={20} font={"Roboto-Bold"}>
          Top rated
        </FontText>
      </View>
      <View style={{ height: 220 }}>
        <MovieListScroll id={"topRated"} showType={showType} navigation={navigation} key={showType} />
      </View>
    </View>
  );
};

const Home = ({ route, navigation }) => {
  const [showType] = useGlobalState("showType");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // deep linking
  // const isScreenMounted = useRef(true);
  // const URL = Linking.useURL() || "noUrl";

  // useEffect(() => {
  //   if (!isScreenMounted.current) return;
  //   const getMovieData = async () => {
  //     let cleanURL = Linking.parse(URL);
  //     if (cleanURL.queryParams.id !== undefined) {
  //       const getMovies = await fetch(infoUrl[0] + cleanURL.queryParams.id + infoUrl[1]);
  //       const json = await getMovies.json();
  //       json["genre_ids"] = json["genres"].map((genre) => genre.id);
  //       navigation.push("MovieScreen", { jsonObject: json });
  //     }
  //   };
  //   getMovieData(URL);
  // }, [URL]);

  useEffect(() => {
    (async () => {
      await DB.initDatabase();
      migrateDatabase();
      const disclaimer = await getValue("hide_disclaimer");
      if (!disclaimer) {
        setShowDisclaimer(true);
      }
    })();
  }, []);

  const hideDisclaimer = () => {
    setValue("hide_disclaimer", true);
    setShowDisclaimer(false);
  };

  return (
      <View style={styles.container}>
        <TopBar navigation={navigation} hambAction={"openD"} />
        <MovieOrSeries />

        <MovieListVerticalScroll id={"popular"} navigation={navigation} showType={showType} component={[CarouselBanner, NowPlaying, UpComing, TopRated]} />
        {showDisclaimer && <Disclaimer closeDisclaimer={() => hideDisclaimer()} />}
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
