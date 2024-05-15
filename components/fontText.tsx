import { StyleSheet, View, Text } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import React, { useState, useEffect, useCallback } from "react";

import { useFonts } from "expo-font";


SplashScreen.preventAutoHideAsync();

interface Props {
  font?: "bold" | "regular" | "medium" | "thin" | any;
  numberOfLines?:number;
  lineHeight?:number;
  color?:string;
  fontSize?:number;
  underline?: boolean;
  children?:any;
}

const FontText: React.FC<Props> = props => {
  // const [fontLoad] = useFonts({
  //   "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
  //   "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
  //   "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
  //   "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  //   "Roboto-Thin": require("../assets/fonts/Roboto-Thin.ttf"),
  // });

  // const fontTree = () => {
  //   if (props.font === "bold") return "Roboto-Bold" 
  //   if (props.font === "regular") return "Roboto-Regular" 
  //   if (props.font === "medium") return "Roboto-Medium" 
  //   if (props.font === "thin") return "Roboto-Thin" 
  //   return "Roboto-Bold"
  // }

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  // if (!fontLoad) return null;

  return (
    <View onLayout={onLayoutRootView}>
      <Text
        numberOfLines={props.numberOfLines}
        style={{
          lineHeight:props.lineHeight,
          color: props.color || "white",
          // fontFamily: fontTree(),
          fontSize: props.fontSize,
          textDecorationLine: props.underline ? "underline" : "none"
        }}
      >
        {props.children}
      </Text>
    </View>
  );
};

export { FontText };
