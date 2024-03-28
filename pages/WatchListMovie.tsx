import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TopBar } from "../components/topBar";
import Colors from "../src/style";
import { FontText } from "../components/fontText";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

interface WatchListMovieProps {
  navigation: any;
  route: any;
}

const WatchListMovie: React.FC<WatchListMovieProps> = props => {
  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} hambAction={"openD"} />

      <View style={{ margin: "5%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <View style={styles.addWatchList}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <FontText fontSize={22} font={"Roboto-Bold"}>
          helloing
        </FontText>
      </View>

			
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
