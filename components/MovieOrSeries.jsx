import { FontText } from "../components/fontText";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { setGlobalState, useGlobalState } from "../global/state";
import { useEffect, useState } from "react";

const MovieOrSeries = ({}) => {
  const [activeType, setActiveType] = useState()
  const [showType] = useGlobalState("showType")

  useEffect(() => {
    setActiveType(showType)
  }, [showType])

  const selectedType = (type) => {
    setGlobalState("showType", type);
    setActiveType(type)
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, activeType === "movie" && styles.active]} onPress={() => selectedType("movie")}>
        <FontText fontSize={15} font={"regular"}>
          Movie
        </FontText>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, activeType === "tv" && styles.active]} onPress={() => selectedType("tv")}>
        <FontText fontSize={15} font={"regular"}>
          TV show
        </FontText>
      </TouchableOpacity>
    </View>
  );
};

export default MovieOrSeries;

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
