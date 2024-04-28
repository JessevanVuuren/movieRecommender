import { baseUrl342, descriptionFix, getMasterDetails, getShowType, round } from "../../src/helper";
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, BackHandler } from "react-native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import React, { useEffect, useState } from "react";
import * as DB from "../../src/watchListSQL";
import { FontText } from "../fontText";
import Colors from "../../src/style";
import { MovieModel } from "../../models/watchList";

interface WatchListProps {
  navigation: any;
  list_id:number
}

const WatchList: React.FC<WatchListProps> = ({ navigation, list_id }) => {
  const [reload, setReload] = useState<number>(Math.random());
  const [data, setData] = useState([]);

  useEffect(() => {
    let is_sorted = true
    let index = 0
    data.map((movie) => {
      if (index == movie.list_order) index += 1
      else is_sorted = false
    })
    if (!is_sorted) sort_list(data)
  }, [data])

  const sort_list = async (data) => {
    for (let i = 0; i < data.length; i++) {
      await DB.update_movie_order(data[i].id, i)
    }
  }

  useEffect(() => {
    // navigation.addListener('focus', () => setReload(Math.random()));
    BackHandler.addEventListener("hardwareBackPress", (): any => setReload(Math.random()));
  }, []);

  useEffect(() => {
    (async () => {

      const movies = await DB.fetch_movie(list_id)
      movies.map((e) => e.movie_data = JSON.parse(e.movie_data))
      setData(movies);
    })();
  }, [reload]);

  const rowRenderer = ({ item, drag, isActive }) => {
    return (
      <View style={{marginTop: 10}}>
        <ScaleDecorator activeScale={1.05}>
          <TouchableOpacity onLongPress={drag} style={{ height: 150 }} disabled={isActive} onPress={() => { moveToMovie(item.show_type, item.movie_data); }}>
            <View style={styles.listItem}>
              <View style={{ alignItems: "flex-start", flex: 1 }}>
                <Image style={styles.img} source={{ uri: baseUrl342 + item.movie_data.poster_path }} />
              </View>

              <View style={{ marginLeft: 110 }}>
                <View style={{ marginBottom: 2 }}>
                  <FontText font={"Roboto-Bold"} fontSize={12} numberOfLines={2}>
                    {item.show_type === "movie" ? item.movie_data.title : item.movie_data.name}
                  </FontText>
                </View>
                <View style={styles.movieRatingRow}>
                  <FontText color={Colors.mainColor} font={"Roboto-Bold"} fontSize={12}>
                    {item.show_type === "movie" ? item.movie_data.release_date.split("-")[0] : item.movie_data.first_air_date.split("-")[0]}
                  </FontText>
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Image source={require("../../assets/star-symbol.png")} style={[styles.topStar, { height: 10, width: 10 }]} />
                      <FontText color={Colors.textColor} font={"Roboto-Bold"} fontSize={12}>
                        {round(item.movie_data.vote_average)}
                      </FontText>
                    </View>
                  </View>

                  {item.show_type === "tv" && item.movie_data.seasons && (
                    <FontText fontSize={12} font={"Roboto-Bold"}>
                      {item.movie_data.seasons.length} Seasons
                    </FontText>
                  )}
                </View>
                <FontText fontSize={12} font={"Roboto-Bold"}>
                  {descriptionFix(item.movie_data.overview, false, 130).text}
                </FontText>
              </View>
            </View>
          </TouchableOpacity>
        </ScaleDecorator>
      </View>
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

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={data}
        renderItem={rowRenderer}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => setData(data)}
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
  genresView: {
    marginBottom: 5,
    marginRight: 10,
  },
});


export default WatchList;
