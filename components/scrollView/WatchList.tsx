import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { baseUrl342, descriptionFix, getShowType, round } from "../../src/helper";
import { FontText } from "../fontText";
import Colors from "../../src/style";
import { getAllMovies } from "../../src/saveLoadWatchList";

interface WatchListProps {
  navigation: any;
}

const WatchList: React.FC<WatchListProps> = ({ navigation }) => {
  const [data, setData] = useState([]);

  const _layoutProvider = useRef(layoutMaker()).current;
  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);

  const rowRenderer = (type, data) => {
    const show = data.item.movieData;
    const showType = getShowType(show.title)
    return (
      <TouchableOpacity
        onPress={() => {
          moveToMovie(showType, show);
        }}
        style={{ height: 150 }}
      >
        <View style={styles.listItem}>
          <View style={{ alignItems: "flex-start", flex: 1 }}>
            <Image style={styles.img} source={{ uri: baseUrl342 + show.poster_path }} />
          </View>

          <View style={{ marginLeft: 110 }}>
            <View style={{ marginBottom: 2 }}>
              <FontText font={"Roboto-Bold"} fontSize={12} numberOfLines={2}>
                {showType === "movie" ? show.title : show.name}
              </FontText>
            </View>
            <View style={styles.movieRatingRow}>
              <FontText color={Colors.mainColor} font={"Roboto-Bold"} fontSize={12}>
                {showType === "movie" ? show.release_date.split("-")[0] : show.first_air_date.split("-")[0]}
              </FontText>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Image source={require("../../assets/star-symbol.png")} style={[styles.topStar, { height: 10, width: 10 }]} />
                  <FontText color={Colors.textColor} font={"Roboto-Bold"} fontSize={12}>
                    {round(show.vote_average)}
                  </FontText>
                </View>
              </View>

              <FontText fontSize={12} font={"Roboto-Bold"}>
                {show.genres && show.genres.length} geld
              </FontText>

              {/* {showType === "tv" && show.seasons && (
                <FontText fontSize={12} font={"Roboto-Bold"}>
                  {show.seasons.length} Seasons
                </FontText>
              )} */}
            </View>
            <FontText fontSize={12} font={"Roboto-Bold"}>
              {descriptionFix(show.overview, false, 130).text}
            </FontText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const moveToMovie = async (type, data) => {
    if (type === "movie") {
      console.log(data.title + ", " + data.id);
      navigation.push("MovieScreen", { jsonObject: data });
    } else {
      console.log(data.name + ", " + data.id);
      navigation.push("TvScreen", { jsonObject: data });
    }
  };

  useEffect(() => {
    (async () => {
      const list = await getAllMovies();
      const fullList = [];
      for (let i = 0; i < list.length; i++) {
        fullList.push({ type: "NORMAL", item: list[i] });
      }
      setData(fullList);
    })();
  }, []);

  if (!data.length) return null;

  return (
    <View style={{ flex: 1 }}>
      <RecyclerListView layoutProvider={_layoutProvider} dataProvider={dataProvider} rowRenderer={rowRenderer} />
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
  genresView: {
    marginBottom: 5,
    marginRight: 10,
  },
});

const dataProviderMaker = (data: any) => new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

const layoutMaker = () =>
  new LayoutProvider(
    () => "NORMAL",
    (type, dim) => {
      switch (type) {
        case "NORMAL":
          dim.width = Dimensions.get("window").width;
          dim.height = 165;
          break;
      }
    }
  );

export default WatchList;
