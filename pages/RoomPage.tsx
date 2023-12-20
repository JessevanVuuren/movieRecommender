import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontText } from "../components/fontText";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import React, { useState } from "react"
import Colors from "../src/style";


interface RoomPageProps {
  navigation: any;
  route: any;
}

const RoomPage: React.FC<RoomPageProps> = props => {
  const [connected, setConnected] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
        <Ionicons style={styles.backArrow} name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      {connected ?
        <View>

        </View> :
        <View style={styles.notConnectedContainer}>
          <View>
            <TouchableOpacity style={[styles.buttonBackGround, { marginBottom: 30 }]}>
              <FontText fontSize={23} font={"Roboto-Bold"} style={styles.buttonText}>
                Create room
              </FontText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonBackGround}>
              <FontText fontSize={23} font={"Roboto-Bold"}>
                Join room
              </FontText>
            </TouchableOpacity>
          </View>
        </View>
      }


    </View>
  )
}

export { RoomPage }


const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
  backArrow: {
    marginLeft: 8,
    marginTop: 6.7,
  },
  backButton: {
    width: 40,
    zIndex: 10,
    height: 40,
    marginLeft: 15,
    borderRadius: 25,
    position: "absolute",
    backgroundColor: "#FFFFFF50",
    marginTop: 15 + Constants.statusBarHeight,
  },
  notConnectedContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",

  },
  buttonText: {

  },
  buttonBackGround: {
    height: 80,
    width: 200,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.darkLight,
  }
})