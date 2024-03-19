import { StyleSheet, View, BackHandler, Button, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";

import Modal from "react-native-modal";

import { WatchListModel } from "../models/watchList";

import WatchList from "../components/scrollView/WatchList";
import { FontText } from "../components/fontText";
import { TopBar } from "../components/topBar";
import Colors from "../src/style";
import * as DB from "../src/watchListSQL";
import { AntDesign } from "@expo/vector-icons";
import AddWatchListModal from "../components/AddWatchListModal";

const COLORS = [Colors.background ,"#ff0000", "#00ff00", "#0000ff", "#ff0000", "#ff0000", "#ff0000", "#ff0000"];

const WatchListView = ({ navigation }) => {
  const [watchListModal, setWatchListModal] = useState(true);
  const [watchListSettings, setWatchListSettings] = useState({});

  useEffect(() => {
    const initDB = async () => {
      DB.initDatabase();
    };
    initDB();
  }, []);

  const get = async () => {
    const data = await DB.fetch_watchList();
    console.log(data.rows._array);
  };

  const createWatchList = async (name, color) => {
    setWatchListModal(false)
    if (name == "") return
    console.log(name)
    console.log(color)
  };

  const deleteW = async () => {
    console.log(await DB.delete_watchList(1));
  };

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} hambAction={"openD"} />

      <View style={{ margin: "5%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <FontText fontSize={22} font={"Roboto-Bold"}>
          Your Watchlist
        </FontText>
        <TouchableOpacity onPress={() => setWatchListModal(true)}>
          <View style={styles.addWatchList}>
            <AntDesign name="plus" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={watchListModal}
        onBackButtonPress={() => setWatchListModal(false)}
        onBackdropPress={() => {
          setWatchListModal(false);
        }}>
        <AddWatchListModal colors={COLORS} cancel={() => setWatchListModal(false)} create={createWatchList} />
      </Modal>
    </View>
  );
};

export { WatchListView };

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    width: "100%",
    flex: 1,
  },
  mainMenu: {
    backgroundColor: Colors.mainColor,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
  },
  menuHamburger: {
    margin: 10,
  },
  menuSearch: {
    margin: 10,
  },
  addWatchList: {
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: Colors.darkLight,
  },
  watchListPopup: {
    height: 100,
    width: 100,
  },
});
