import { StyleSheet, View, TouchableOpacity } from "react-native";
import { FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import Colors from "../src/style";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";

import { FontText } from "../components/fontText";

export const TopBar = (props) => {
  const hamburger = () => {
    if (props.hambAction == "openD") props.navigation.openDrawer();
    if (props.hambAction == "goBack") props.navigation.goBack();
  };

  const goToRoom = () => {
    console.log("nice")
    props.navigation.navigate("RoomPage");
  }

  return (
    <View>
      <View style={{ backgroundColor: Colors.background, height: Constants.statusBarHeight }}></View>
      <View style={styles.mainMenu}>
        <StatusBar style="light" />
        <TouchableOpacity style={styles.menuHamburger} onPress={hamburger}>
          {props.hambAction == "openD" ? <Feather name="menu" size={30} color="white" /> : <Ionicons name="arrow-back-sharp" size={30} color="white" />}
        </TouchableOpacity>

        {props.extra != "hideSearchBar" && (
          <TouchableOpacity style={styles.searchBar} onPress={() => props.navigation.navigate("SearchScreen")}>
            <View style={styles.menuSearch}>
              <View style={{ justifyContent: "center" }}>
                <FontAwesome style={{ color: Colors.textColor }} name="search" size={17} color="black" />
              </View>
              <View style={{ marginLeft: 10 }}>
                <FontText font={"Roboto-Medium"} fontSize={17}>
                  Search for a show
                </FontText>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.menuRoom} onPress={goToRoom}>
          <Ionicons name="people" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainMenu: {
    backgroundColor: Colors.background,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
  },
  menuHamburger: {
    marginLeft: "5%",
  },
  menuRoom:{
    marginRight: "5%",
  },  
  menuSearch: {
    marginLeft: 10,
    flexDirection: "row",
  },
  searchBar: {
    height: 40,
    width: "60%",
    borderRadius: 25,
    justifyContent: "center",
    backgroundColor: Colors.darkLight,
  },
});
