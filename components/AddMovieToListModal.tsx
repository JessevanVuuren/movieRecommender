import { StyleSheet, TouchableOpacity, View } from "react-native";
import { WatchListModel } from "../models/watchList";
import React, { useEffect, useState } from "react"
import * as DB from "../src/watchListSQL";
import { FontText } from "./fontText";
import Colors from '../src/style';

import { Fontisto } from '@expo/vector-icons';


interface AddMovieToListModalProps {
  done: () => {},
  movie_key: string
}

const AddMovieToListModal: React.FC<AddMovieToListModalProps> = props => {
  const [text, setText] = useState("")
  const [watchList, setWatchList] = useState([])

  useEffect(() => {
    getWatchList()
  }, [])


  const getWatchList = async () => {
    const data = await DB.fetch_watchList()
    const newList = []
    for (let i = 0; i < data.length; i++) {
      newList.push({ ...data[i], inList: await DB.check_if_movie_in_list(data[i].id, props.movie_key) })
    }
    setWatchList(newList)
  }

  const addOrRemove = (list) => {
    if (list.inList) DB.delete_movie(list.id, props.movie_key)
    else DB.store_movie(list.id, props.movie_key)
    
    getWatchList()
  }
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <FontText fontSize={20} font={"Roboto-Bold"}>Add to WatchList</FontText>
      </View>

      <View>
        {watchList.map((list) =>
          <TouchableOpacity onPress={() => addOrRemove(list)} style={styles.listRow} key={list.id}>

            <View style={styles.checkbox}>
              {list.inList ? <Fontisto name="checkbox-active" size={15} color={Colors.mainColor} /> : <Fontisto name="checkbox-passive" size={15} color="white" />}
            </View>

            <FontText fontSize={20} font={"Roboto-Bold"}>{list.name}</FontText>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => props.done()}>
          <FontText fontSize={20} font={"Roboto-Bold"}>Done</FontText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddMovieToListModal


const styles = StyleSheet.create({
  container: {
    width: "80%",
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: Colors.background
  },
  title: {
    padding: 10,
    alignItems: "center",
    backgroundColor: Colors.darkLight,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginBottom: 10,
  },

  listRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  checkbox: {
    paddingRight: 10
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 10
  },
  button: {
    backgroundColor: Colors.darkLight,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5
  }
})