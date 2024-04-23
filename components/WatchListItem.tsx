import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { MovieModel, WatchListModel } from "../models/watchList";
import { FontText } from "./fontText";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Modal from "react-native-modal";
import * as DB from "../src/watchListSQL";

import Colors from "../src/style";
import { GestureEvent, PanGestureHandler, TouchableOpacity } from "react-native-gesture-handler";
import DeleteItemModal from "./DeleteItemModal";
import AddWatchListModal from "./AddWatchListModal";


interface WatchListItemProps {
  item: WatchListModel;
  navigation: any;
  route: any;
  update_list: () => {}
}

const WatchListItem: React.FC<WatchListItemProps> = ({ navigation, route, item, update_list }) => {
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [watchListModal, setWatchListModal] = useState(false);
  const translateX = new Animated.Value(0);
  const [start, setStart] = useState(0)

  const goToList = () => {
    navigation.push("WatchListMovie", {data: item, navigation: navigation});
  };

  translateX.addListener((value) => {

    if (value.value > 90) translateX.setValue(90)
    if (value.value < 0) translateX.setValue(0)
  })

  const startedEvent = (e: GestureEvent) => {
    setStart(e.nativeEvent.x as number)
  }

  const endEvent = (e: GestureEvent) => {
    if ((translateX as any)._value < 90) {
      Animated.timing(translateX, {
        toValue: 0,
        useNativeDriver: false,
        duration: 300
      }).start()
    }
  };

  const onPanEvent = (e: GestureEvent) => {
    translateX.setValue((e.nativeEvent.absoluteX as number) - start)
  }

  const edit_list = async (name: string, color: string) => {
    setWatchListModal(false)
    translateX.setValue(0)
    if (name == "") return

    await DB.update_watchList(name, color, item.id)
    update_list()
  }

  const delete_list = async () => {
    setDeleteItemModal(false)
    translateX.setValue(0)
    await DB.delete_watchList(item.id)
    update_list()

  }

  return (
    <View style={styles.container}>
      <View style={[styles.settings, { backgroundColor: item.color }]}>
        <TouchableOpacity style={styles.changeList} onPress={() => setWatchListModal(true)}>
          <FontAwesome5 name="edit" size={24} color={Colors.background} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.changeList} onPress={() => setDeleteItemModal(true)}>
          <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <PanGestureHandler onGestureEvent={onPanEvent} onEnded={endEvent} onActivated={startedEvent}>
        <Animated.View style={[styles.watchList, { transform: [{ translateX: translateX }] }]}>
          <TouchableOpacity onPress={goToList}>

          <FontText fontSize={22} font={"Roboto-Bold"}>
            {item.name}
          </FontText>

          <View style={styles.amountMovie}>
            <MaterialIcons style={styles.movieIcon} name="movie" size={24} color={item.color} />

            <FontText fontSize={22} font={"Roboto-Bold"}>
              {item.amount}
            </FontText>
          </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>

      
    <Modal
        isVisible={deleteItemModal}
        onBackButtonPress={() => setDeleteItemModal(false)}
        onBackdropPress={() => {
          setDeleteItemModal(false);
        }}
      >
        <DeleteItemModal title={item.name} cancel={async () => {setDeleteItemModal(false); translateX.setValue(0)}} delete={async () => delete_list()} />
      </Modal>


      <Modal
        isVisible={watchListModal}
        onBackButtonPress={() => setWatchListModal(false)}
        onBackdropPress={() => {
          setWatchListModal(false);
        }}
      >
        <AddWatchListModal cancel={async () => {setWatchListModal(false); translateX.setValue(0)}} create={edit_list} edit={item} />
      </Modal>

    </View>
  );
};

export default WatchListItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  watchList: {
    backgroundColor: Colors.darkLight,
    paddingLeft: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
  settings: {
    flexDirection: "row",
    alignItems:"center",
    paddingLeft:10,
    width: 140,
    height: "100%",
    position: "absolute",
    marginLeft: -10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  changeList: {
    padding:10,
  },
  amountMovie: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieIcon: {
    paddingRight: 10,
  },
});
