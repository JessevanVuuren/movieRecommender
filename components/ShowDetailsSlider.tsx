import MovieListScroll from "../components/scrollView/MovieListScroll"
import { TouchableOpacity } from "react-native-gesture-handler"
import { StyleSheet, Text, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { FontText } from "./fontText"
import Colors from "../src/style"
import React, { } from "react"


interface ShowDetailsSliderProps {
  sort_type:string;
  navigation: any;
  show_key:string;
  extra: boolean;
  name: string;
  type:string;
  list: any;
}

const ShowDetailsSlider: React.FC<ShowDetailsSliderProps> = props => {

  const goto_extraShowList = () => {
    props.navigation.push("ExtraShowsList", {key: props.show_key, show_type: props.type, sort_type:props.sort_type})
  }

  return (
    <View>
      <TouchableOpacity style={{ marginHorizontal: "4%", marginTop: 0, marginBottom: 10, flexDirection: "row", alignItems: "center" }} disabled={!props.extra} onPress={goto_extraShowList}>
        <FontText fontSize={20} font={"Roboto-Bold"}>
          {props.name}
        </FontText>

        {props.extra &&
          <View style={{ marginTop: 4, backgroundColor: Colors.background_highlight, borderRadius: 3, marginLeft: 10 }}>
            <MaterialIcons name="keyboard-arrow-right" size={24} color={Colors.textColor} />
          </View>
        }

      </TouchableOpacity>
      <View style={{ flex: 1, height: 230 }}>
        <MovieListScroll showType={props.type} master_data={props.list} navigation={props.navigation} />
      </View>
    </View>

  )
}

export default ShowDetailsSlider


const styles = StyleSheet.create({
  container: {

  },
})