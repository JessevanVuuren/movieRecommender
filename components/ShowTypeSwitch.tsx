import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FontText } from "./fontText";
import Colors from "../src/style"
import React, { useState } from "react"


interface ShowTypeSwitchProps {
  set_type: (show_type:string) => void
}

const ShowTypeSwitch: React.FC<ShowTypeSwitchProps> = props => {
  const [show, setShow] = useState("movie")

  const setSelected = (show:string) => {
      setShow(show)
      props.set_type(show)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, show === "movie" && styles.active]} onPress={() => setSelected("movie")}>
        <FontText fontSize={15} font={"regular"}>
          Movie
        </FontText>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, show === "tv" && styles.active]} onPress={() => setSelected("tv")}>
        <FontText fontSize={15} font={"regular"}>
          TV show
        </FontText>
      </TouchableOpacity>
    </View>
  );
}

export default ShowTypeSwitch

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: "4%",
    justifyContent: "space-between",
    marginVertical: 5,
  },

  button: {
    backgroundColor: Colors.darkLight,
    width: "48.3%",
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 25,
  },
  active: {
    borderColor: Colors.mainColor,
    borderWidth: 1.1,
  },
});
