import { BackHandler, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { TopBar } from "../components/topBar";
import Colors from "../src/style";
import { FontText } from "../components/fontText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { MovieModel } from "../models/watchList";
import * as DB from "../src/watchListSQL";
import WatchList from "../components/scrollView/WatchListV2";
import { useNavigation } from "@react-navigation/native";

interface WatchListMovieProps {
  navigation: any;
  route: any;
}

const WatchListMovie: React.FC<WatchListMovieProps> = props => {
  const [movies, setMovies] = useState<MovieModel[]>([])
  const [reload, setReload] = useState<number>(Math.random());

  useEffect(() => {
    
    // getMovies()
    // const backHandler = BackHandler.addEventListener("hardwareBackPress", (): any => {
    //   setReload(Math.random())
    // });

    // return () => backHandler.remove();
  }, [])

  // const getMovies = async () => {
  //   const data = await DB.fetch_movie(props.route.params.data.id)
  //   setMovies(data)
  // }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} hambAction={"goBack"} />

      <View style={{ margin: "5%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <View style={styles.addWatchList}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <FontText fontSize={22} font={"Roboto-Bold"}>
          {props.route.params.data.name}
        </FontText>
      </View>

      <WatchList navigation={props.navigation} list_id={props.route.params.data.id}  />
      
    </View>
  );
};

export default WatchListMovie;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    width: "100%",
    flex: 1,
  },
  addWatchList: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.darkLight,
  },
});
