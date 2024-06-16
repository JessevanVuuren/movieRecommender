import { baseUrl342, descriptionFix, getMasterDetails, getShowType, round } from "../../src/helper"
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from "react-native"
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Part } from "../../models/collection"
import { FontText } from "../fontText"
import Colors from "../../src/style"
import { FilmographyCast } from "../../models/filmography"

interface FilmographyScrollProps {
  navigation: any;
  list: FilmographyCast[]
}

const FilmographyScroll: React.FC<FilmographyScrollProps> = ({ navigation, list }) => {
  const dataProviderMaker = (data: any) => new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

  const layoutMaker = () =>
    new LayoutProvider(
      (index) => "NORMAL",
      (type, dim) => {
        switch (type) {
          case "NORMAL":
            dim.width = Dimensions.get("window").width;
            dim.height = 165;
            break;
        }
      }
    );

  const moveToMovie = async (type, key) => {
    if (type === "movie") {
      const data = await getMasterDetails("movie", key)
      navigation.push("MovieScreen", { jsonObject: data });
    } else {
      const data = await getMasterDetails("tv", key)
      navigation.push("TvScreen", { jsonObject: data });
    }
  };

  const rowRenderer = (type, data: FilmographyCast) => {

    const showType = getShowType(data.title)

    return (
      <TouchableOpacity
        onPress={() => { moveToMovie(showType, data.id) }} style={{ height: 150 }}>
        <View style={styles.listItem}>
          <View style={{ alignItems: "flex-start", flex: 1 }}>
            <Image style={styles.img} source={{ uri: baseUrl342 + data.poster_path }} />
          </View>

          <View style={{ marginLeft: 110 }}>
            <View style={{ marginBottom: 2 }}>
              <FontText font={"Roboto-Bold"} fontSize={12} numberOfLines={2}>
                {showType === "movie" ? data.title : data.name}
              </FontText>
            </View>
            <View style={styles.movieRatingRow}>
              <FontText color={Colors.mainColor} font={"Roboto-Bold"} fontSize={12}>
                {showType === "movie" ? data.release_date.split("-")[0] : data.first_air_date.split("-")[0]}
              </FontText>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Image source={require("../../assets/star-symbol.png")} style={[styles.topStar, { height: 10, width: 10 }]} />
                  <FontText color={Colors.textColor} font={"Roboto-Bold"} fontSize={12}>
                    {round(data.vote_average)}
                  </FontText>
                </View>
              </View>
            </View>
            <View style={{ marginRight: 10 }}>

              <FontText fontSize={12} font={"Roboto-Bold"}>
                {descriptionFix(data.overview, false, 200).text}
              </FontText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const dataProvider = useMemo(() => dataProviderMaker(list), [list]);
  const _layoutProvider = useRef(layoutMaker()).current;

  return (
    <View style={{ flex: 1, height: list.length * 165 }}>
      <RecyclerListView
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={rowRenderer}
        scrollViewProps={{
          showsHorizontalScrollIndicator: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    paddingLeft: Dimensions.get("window").width * 0.04,
  },
  img: {
    height: 150,
    width: 100,
    borderRadius: 10,
  },
  movieRatingRow: {
    marginBottom: 5,
    flexDirection: "row",
  },
  voteAverage: {
    color: Colors.textColor,
    fontSize: 16,
    marginTop: 5,
  },
  topStar: {
    marginTop: 3,
    marginRight: 3,
  },
});

export default FilmographyScroll;
