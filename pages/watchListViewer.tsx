import { StyleSheet, View, BackHandler, Button, TouchableOpacity, Text } from "react-native";
import React, { useState, useEffect } from "react";

import Modal from "react-native-modal";

import { WatchListModel } from "../models/watchList";

import { FontText } from "../components/fontText";
import { TopBar } from "../components/topBar";
import Colors from "../src/style";
import * as DB from "../src/watchListSQL";
import { AntDesign } from "@expo/vector-icons";
import AddWatchListModal from "../components/AddWatchListModal";
import WatchListItem from "../components/WatchListItem";
import { fill_with_test } from "../src/debug";


const WatchListView = ({ navigation, route }) => {

  const [watchListList, setWatchListList] = useState<WatchListModel[]>([]);
  const [watchListModal, setWatchListModal] = useState(false);
  const [reload, setReload] = useState<number>(Math.random());


  useEffect(() => {
    navigation.addListener('focus', () => setReload(Math.random()));
    BackHandler.addEventListener("hardwareBackPress", (): any => setReload(Math.random()));
  }, []);

  useEffect(() => {
    fill_with_test()

    getWatchList();
  }, [reload])


  const getWatchList = async () => {
    const data: WatchListModel[] = await DB.fetch_watchList();
    setWatchListList(data);
  };

  const createWatchList = async (name: string, color: string) => {
    setWatchListModal(false);
    if (name == "") return;

    await DB.store_watchList(name, color);
    getWatchList();
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

      <View style={styles.listContainer} >

        {watchListList.map((list, index) =>
          <WatchListItem item={list} key={index} navigation={navigation} route={route} update_list={getWatchList} />
        )}
      </View>

      <Modal isVisible={watchListModal} onBackButtonPress={() => setWatchListModal(false)} onBackdropPress={() => { setWatchListModal(false); }}>
        <AddWatchListModal cancel={async () => setWatchListModal(false)} create={createWatchList} edit={null} />
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
  listContainer: {
    width: "90%",
    flex: 1,
    alignSelf: "center"
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
