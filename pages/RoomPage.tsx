import { StyleSheet, TouchableOpacity, View, Image, Dimensions } from "react-native"
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import MovieTinder from "../components/movieTinder"
import React, { useEffect, useState } from "react"
import { FontText } from "../components/fontText"
import { CONNECTION, ROOM, SEND } from "../models/room"
import Constants from "expo-constants"
import Colors from "../src/style"
import { baseUrl500, getMasterDetails } from "../src/helper"
import { MovieModel } from "../models/movie"

const WIDTH = Dimensions.get("window").width

interface RoomPageProps {
  navigation: any;
  route: any;
}

const RoomPage: React.FC<RoomPageProps> = props => {
  const [ws, setWS] = useState<WebSocket>(null)
  const [connected, setConnected] = useState(false)

  const [finalMovie, setFinalMovie] = useState<MovieModel>(null)
  const [finalMovieID, setFinalMovieID] = useState<string>(null)
  const [likedMovieList, setLikedMovieList] = useState<MovieModel[]>([])

  const [joinRoom, setJoinRoom] = useState<boolean>(false)
  const [roomKey, setRoomKey] = useState<string>("")

  const [room, setRoom] = useState<ROOM>(null)

  useEffect(() => {
    const ws = new WebSocket(process.env.EXPO_ROOM_WSS + "/ws");
    setWS(ws)

    ws.onerror = (e) => {
      console.log("error:")
      console.log(e)
      setConnected(false)
      setRoom(null)
    }

    ws.onmessage = async (e) => {
      const response: ROOM = JSON.parse(await e.data)
      if (response.success) {
        setJoinRoom(false)
        setRoom(response)
        setRoomKey(response.payload.key)
        setConnected(true)

        if (response.payload.final_movie) setFinalMovieID(response.payload.final_movie)
        else reset_final_movie()
      }
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

  useEffect(() => {
    for (let i = 0; i < likedMovieList.length; i++) {
      if (likedMovieList[i].id.toString() === finalMovieID) {
        setFinalMovie(likedMovieList[i])
      }
    }
  }, [finalMovieID])

  useEffect(() => {
    if (roomKey.length === 5) join()
  }, [roomKey])

  const send_preference = (movie: MovieModel, preference: string) => {
    setLikedMovieList([...likedMovieList, movie])

    const preference_json: SEND = { type: "movie", method: preference, key: roomKey, id: movie.id.toString() }
    ws.send(JSON.stringify(preference_json))
  }

  const create_room = async () => {
    const create: CONNECTION = { type: "room", method: "create", key: null }
    ws.send(JSON.stringify(create))
  }

  const disconnect = async () => {
    const leave: CONNECTION = { type: "room", method: "leave", key: null }
    ws.send(JSON.stringify(leave))
    setConnected(false)
    setRoomKey("")
  }

  const join = async () => {
    const leave: CONNECTION = { type: "room", method: "join", key: roomKey }
    ws.send(JSON.stringify(leave))
  }

  const backArrow = async () => {
    if (joinRoom) {
      setJoinRoom(false)
      setRoomKey("")
    }
    else props.navigation.goBack()
  }

  const addKey = (key: number) => {
    if (roomKey.length < 5) setRoomKey(roomKey + key)
  }

  const remKey = () => {
    setRoomKey(roomKey.slice(0, -1))
  }

  const keyJSX = (key: number) => {
    return (
      <TouchableOpacity key={key} style={styles.keyboardKey} onPress={() => addKey(key)}>
        <FontText fontSize={23} font={"Roboto-Bold"}>{key}</FontText>
      </TouchableOpacity>
    )
  }

  const open_movie = async () => {
    const data = await getMasterDetails("movie", finalMovieID)
    disconnect()
    reset_final_movie()
    props.navigation.push("MovieScreen", { jsonObject: data });
  }

  const reset_final_movie = () => {
    setFinalMovie(null)
    setFinalMovieID(null)
  }

  const cancel_movie = () => {
    const preference_json: SEND = { type: "movie", method: "cancel_final_movie", key: roomKey, id: "" }
    ws.send(JSON.stringify(preference_json))
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
              <View style={styles.peopleIcon}><FontAwesome5 name="users" size={24} color="white" /></View>
              <FontText fontSize={23} font={"Roboto-Bold"} color={Colors.mainColor} >{room.payload.amount_of_users}</FontText>
            </TouchableOpacity>

          </View>
        </View> :
        <TouchableOpacity style={styles.backButton} onPress={backArrow}>
          <Ionicons style={styles.backArrow} name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      }

      {connected ?
        <View>
          <MovieTinder navigation={props.navigation} route={props.route} send_preference={send_preference} room={room} />
        </View> :
        <View style={styles.notConnectedContainer}>
          {joinRoom ?
            <View style={styles.joinRoomContainer}>
              <View style={styles.joinRoomKey}>
                {[...Array(5).keys()].map((i) =>
                  <View key={i} style={styles.joinRoomNumber}>
                    <FontText fontSize={23} font={"Roboto-Bold"} color={Colors.mainColor}>{roomKey[i] !== undefined ? roomKey[i] : ""}</FontText>
                  </View>
                )}
              </View>
              <View style={styles.keyboardPad}>

                <View style={styles.keyboardRow}>{[...Array(3).keys()].map((i) => keyJSX(i + 1))}</View>
                <View style={styles.keyboardRow}>{[...Array(3).keys()].map((i) => keyJSX(i + 4))}</View>
                <View style={styles.keyboardRow}>{[...Array(3).keys()].map((i) => keyJSX(i + 7))}</View>

                <View style={styles.keyboardRow}>
                  <View style={[styles.keyboardKey, { backgroundColor: Colors.background }]}>
                  </View>

                  {keyJSX(0)}

                  <TouchableOpacity style={[styles.keyboardKey, { backgroundColor: Colors.background }]} onPress={remKey}>
                    <Ionicons name="md-backspace-outline" size={40} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View> :
            <View>
              <TouchableOpacity style={[styles.buttonBackGround, { marginBottom: 30 }]} onPress={create_room}>
                <FontText fontSize={23} font={"Roboto-Bold"}>Create room</FontText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonBackGround} onPress={() => setJoinRoom(true)}>
                <FontText fontSize={23} font={"Roboto-Bold"}>Join room</FontText>
              </TouchableOpacity>
            </View>
          }
        </View>
      }

      {finalMovie !== null && <View style={styles.finalMovie}>
        <Image style={styles.cardImg} source={{ uri: baseUrl500 + finalMovie.poster_path }} />
        <View style={styles.final_movie_buttons}>
          <TouchableOpacity style={[styles.final_movie_button, { backgroundColor: Colors.background_highlight }]} onPress={open_movie}>
            <FontText fontSize={23} font={"Roboto-Bold"}>Open movie</FontText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.final_movie_button, { backgroundColor: Colors.darkLight }]} onPress={cancel_movie}>
            <FontText fontSize={23} font={"Roboto-Bold"}>Cancel</FontText>
          </TouchableOpacity>
        </View>

      </View>}
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
    marginTop: 10
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
    marginTop: 3,
    marginRight: 10
  },
  peopleList: {
    marginRight: 15,
    flexDirection: "row"
  },
  leaveButton: {
    backgroundColor: "#FFFFFF50",
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginLeft: 10

  },
  notConnectedContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    width: "100%"
  },
  buttonBackGround: {
    height: 80,
    width: 200,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.darkLight,
  },
  joinRoomContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  joinRoomKey: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },
  joinRoomNumber: {
    backgroundColor: Colors.darkLight,
    borderRadius: 5,
    height: 50,
    width: 40,
    margin: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  keyboardPad: {
    marginBottom: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "100%"
  },
  keyboardRow: {
    flexDirection: "row"
  },
  keyboardKey: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    height: 60,
    backgroundColor: Colors.darkLight,
    width: "25%",
  },
  cardImg: {
    borderRadius: 25,
    width: WIDTH * .9,
    height: 1170 * (WIDTH * .9 / 780),
  },
  finalMovie: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background + "cc",
    position: "absolute"
  },
  final_movie_buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 10,
    alignSelf: "center"
  },
  final_movie_button: {
    width: "48.5%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  }
})