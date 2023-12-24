import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from "react"
import { FontText } from "../components/fontText";
import { ROOM, SEND } from "../models/room";
import Constants from "expo-constants";
import Colors from "../src/style";

import { EXPO_API_WSS } from '@env'


interface RoomPageProps {
  navigation: any;
  route: any;
}

const RoomPage: React.FC<RoomPageProps> = props => {
  var ws = useRef(new WebSocket(EXPO_API_WSS)).current;
  const [connected, setConnected] = useState(false)

  const [room, setRoom] = useState<ROOM>(null)

  useEffect(() => {
    ws.onerror = (e) => {
      console.log("error:")
      console.log(e)
      setConnected(false)
      setRoom(null)
    }

    ws.onmessage = async (e) => {
      const response: ROOM = JSON.parse(await e.data)
      setRoom(response)
      console.log("message:")
      console.log(e)
      setConnected(true)
    }

    ws.onclose = (e) => {
      console.log("close:")
      console.log(e)
      setConnected(false)
      setRoom(null)
    }

    ws.onopen = (e) => {
      console.log("open:")
      console.log(e)
    }
  }, [])

  const create_room = async () => {
    const create: SEND = { type: "room", method: "create", key: null }
    ws.send(JSON.stringify(create))
  }

  const disconnect = async () => {
    const leave: SEND = { type: "room", method: "leave", key: null }
    ws.send(JSON.stringify(leave))
  }

  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: Colors.background, height: Constants.statusBarHeight }}></View>
      {connected ?
        <View>
          <View style={styles.mainMenu}>
            <TouchableOpacity style={styles.leaveButton} onPress={disconnect}>
            <FontText fontSize={20} font={"Roboto-Bold"}>EXIT</FontText>
            </TouchableOpacity>

            <View style={styles.keyText}>
              <FontText fontSize={23} font={"Roboto-Bold"} color={Colors.mainColor}>{room.payload.key.split("").join(" - ")}</FontText>
            </View>

            <TouchableOpacity style={styles.peopleList}>
              <View style={styles.peopleIcon}><FontAwesome5 name="users" size={24} color="white"/></View>
              <FontText fontSize={23} font={"Roboto-Bold"} color={Colors.mainColor} >{room.payload.amount_of_users}</FontText>
            </TouchableOpacity>

          </View>
        </View> :
        <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
          <Ionicons style={styles.backArrow} name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      }

      {connected ?
        <View>
        </View> :
        <View style={styles.notConnectedContainer}>
          <View>
            <TouchableOpacity style={[styles.buttonBackGround, { marginBottom: 30 }]} onPress={create_room}>
              <FontText fontSize={23} font={"Roboto-Bold"}>Create room</FontText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonBackGround}>
              <FontText fontSize={23} font={"Roboto-Bold"}>Join room</FontText>
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
  mainMenu: {
    backgroundColor: Colors.background,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop:10
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
  keyText: {
    alignItems: "center",
  },
  peopleIcon: {
    marginTop:3,
    marginRight:10
  },
  peopleList:{
    marginRight:15,
    flexDirection:"row"
  },  
  leaveButton: {
    backgroundColor: "#FFFFFF50",
    borderRadius:15,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginLeft:10

  },
  notConnectedContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",

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