import { StyleSheet, View, Text } from "react-native";
// import AppLoading from 'expo-app-loading'
import * as SplashScreen from "expo-splash-screen";
import React, { useState, useEffect, useCallback } from "react";
import Colors from "../src/style";

import { useFonts } from "expo-font";

import * as Font from "expo-font";

SplashScreen.preventAutoHideAsync();

const FontText = (props) => {
  const [fontLoad] = useFonts({
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  const fontTree = () => {
    if (props.font === "bold") return "Roboto-Bold" 
    if (props.font === "regular") return "Roboto-Bold" 
    if (props.font === "medium") return "Roboto-Bold" 
    return "Roboto-Bold"
  }

  const onLayoutRootView = useCallback(async () => {
    if (fontLoad) {
      await SplashScreen.hideAsync();
    }
  }, [fontLoad]);

  if (!fontLoad) return null;

  return (
    <View onLayout={onLayoutRootView}>
      <Text
        numberOfLines={props.numberOfLines}
        style={{
          lineHeight:props.lineHeight,
          color: props.color,
          fontFamily: fontTree(),
          fontSize: props.fontSize,
        }}
      >
        {props.children}
      </Text>
    </View>
  );
};

FontText.defaultProps = { color: Colors.textColor, numberOfLines: 0 };

export { FontText };
