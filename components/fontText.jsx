import { StyleSheet, View, Text } from 'react-native'
import AppLoading from 'expo-app-loading'
import React, { useState } from "react"
import Colors from '../src/style'

import * as Font from "expo-font"


const fetchFont = () => {
  return Font.loadAsync({
      "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),
      "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
      "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
      "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf")
  })
}

const FontText = (props) => {

  const [fontLoaded, setFontLoaded] = useState(false)
  if (!fontLoaded) return <AppLoading startAsync={fetchFont} onFinish={() => setFontLoaded(true)} onError={console.warn} />
  
  

  return (
      <Text numberOfLines={props.numberOfLines} style={{
        color: props.color,
        fontFamily: props.font,
        fontSize: props.fontSize
      }}>{ props.children }</Text>
  );
}

FontText.defaultProps = { color: Colors.textColor, numberOfLines:0 };

export { FontText }
