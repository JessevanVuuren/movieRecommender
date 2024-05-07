import { FontAwesome, Feather, Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { FontText } from "./fontText";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import * as DB from "../src/watchListSQL";
import Constants from "expo-constants";
import Colors from "../src/style";

export const TopBar = (props) => {
  const [roomServerIsOnline, setRoomServerIsOnline] = useState(false);
  useEffect(() => {
    (async () => {
      const getServer = await fetch(process.env.EXPO_ROOM_API + "/is-online");

      let unlocked = false;
      const watch = await DB.fetch_watchList();
      watch.map((e) => {
        if (e.name == "unlock_room") unlocked = true;
      });

      if (getServer.ok && unlocked) {
        const isOnline = await getServer.json();
        setRoomServerIsOnline(isOnline["status"]);
      }
    })();
  }, []);

  const hamburger = () => {
    if (props.hambAction == "openD") props.navigation.openDrawer();
    if (props.hambAction == "goBack") props.navigation.goBack();
  };

  const goToRoom = () => {
    props.navigation.navigate("RoomPage");
  };

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
                <FontText font={"medium"} fontSize={17} >
                  Search for a show
                </FontText>
              </View>
            </View>
          </TouchableOpacity>
        )}
        <View style={styles.menuRoom}>
          <TouchableOpacity onPress={goToRoom}>{roomServerIsOnline && <Ionicons name="people" size={30} color="white" />}</TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate("FilterPage")}>
            <View style={{ marginLeft: 10, marginTop: 2.5, transform: [{ rotateZ: "90deg" }] }}>
              <Ionicons name="options" size={30} color="white" />
            </View>
          </TouchableOpacity>
        </View>
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
  menuRoom: {
    flexDirection: "row",
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
