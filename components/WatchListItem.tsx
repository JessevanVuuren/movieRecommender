import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react"
import { MovieModel, WatchListModel } from "../models/watchList";
import { FontText } from "./fontText";
import * as DB from "../src/watchListSQL";
import { TouchableOpacity } from "react-native-gesture-handler";

interface WatchListItemProps {
    item:WatchListModel,
    navigation: any;
    route: any;
}

const WatchListItem: React.FC<WatchListItemProps> = ({navigation, route, item})=> {

  const goToList = () => {
    navigation.push("WatchListMovie")
  }

  return (
    <TouchableOpacity onPress={goToList}>
        <FontText fontSize={22} font={"Roboto-Bold"}>
            {item.name}
        </FontText>
        <FontText fontSize={22} font={"Roboto-Bold"}>
          {item.amount}
        </FontText>
    </TouchableOpacity>
  )
}

export default WatchListItem


const styles = StyleSheet.create({
  container: {
    
  },
})