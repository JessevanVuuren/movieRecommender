import { TouchableOpacity } from "react-native-gesture-handler";
import WatchList from "../components/scrollView/WatchListV3";
import { BackHandler, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FontText } from "../components/fontText";
import { TopBar } from "../components/topBar";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../src/style";

interface WatchListMovieProps {
  navigation: any;
  route: any;
}

const WatchListMovie: React.FC<WatchListMovieProps> = props => {

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} hambAction={"goBack"} />

      <View style={styles.titleHolder}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <View style={styles.addWatchList}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <View style={styles.titleText}>

        <FontText fontSize={22} font={"Roboto-Bold"} >
          {props.route.params.data.name}
        </FontText>
        </View>
      </View>

      <WatchList navigation={props.navigation} list_id={props.route.params.data.id} />

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
  titleHolder: {
    margin: "5%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  titleText: {
    marginRight:20,
    marginLeft:10,
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
