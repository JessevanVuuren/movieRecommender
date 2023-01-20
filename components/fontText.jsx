import { StyleSheet, View, Text } from 'react-native'
// import AppLoading from 'expo-app-loading'
import * as SplashScreen from 'expo-splash-screen';
import React, { useState, useEffect } from "react"
import Colors from '../src/style'

import { useFonts } from 'expo-font';


import * as Font from "expo-font"

SplashScreen.preventAutoHideAsync();


const FontText = (props) => {

  const [fontLoad] = useFonts({
    "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf")
  })

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [fontLoad])

  if (!fontLoad) return null;

  return (
    <Text numberOfLines={props.numberOfLines} style={{
      color: props.color,
      fontFamily: props.font,
      fontSize: props.fontSize
    }}>{props.children}</Text>
  );
}

FontText.defaultProps = { color: Colors.textColor, numberOfLines: 0 };

export { FontText }
