import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useEffect, useState } from "react";
import { MovieModel, WatchListModel } from "../models/watchList";
import { FontText } from "./fontText";
import { MaterialIcons } from "@expo/vector-icons";

import Colors from "../src/style";
import { GestureEvent, PanGestureHandler, TouchableOpacity } from "react-native-gesture-handler";

interface WatchListItemProps {
  item: WatchListModel;
  navigation: any;
  route: any;
}

const WatchListItem: React.FC<WatchListItemProps> = ({ navigation, route, item }) => {
  const [start, setStart] = useState(0)
  const translateX = new Animated.Value(0);



  const goToList = () => {
    navigation.push("WatchListMovie");
  };
  
  translateX.addListener((value) => {
    if (value.value > 90) translateX.setValue(90)
    if (value.value < 0) translateX.setValue(0)
  })

  const startedEvent = (e:GestureEvent) => {
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

  const onPanEvent = (e:GestureEvent) => {
    translateX.setValue((e.nativeEvent.absoluteX as number) - start)
  }


  return (
    <View style={styles.container}>
      <View style={[styles.settings, { backgroundColor: item.color }]}></View>
      <PanGestureHandler onGestureEvent={onPanEvent} onEnded={endEvent} onActivated={startedEvent}>
        <Animated.View style={[styles.watchList, { transform: [{ translateX: translateX }] }]}>
          <FontText fontSize={22} font={"Roboto-Bold"}>
            {item.name}
          </FontText>

          <View style={styles.amountMovie}>
            <MaterialIcons style={styles.movieIcon} name="movie" size={24} color={item.color} />

            <FontText fontSize={22} font={"Roboto-Bold"}>
              {item.amount}
            </FontText>
          </View>
        </Animated.View>
      </PanGestureHandler>
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
    width: 140,
    height: "100%",
    position: "absolute",
    marginLeft: -10,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  amountMovie: {
    flexDirection: "row",
    alignItems: "center",
  },
  movieIcon: {
    paddingRight: 10,
  },
});
