import { baseUrl342, descriptionFix, getMasterDetails, getShowType, round } from "../../src/helper";
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from "react-native";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import { MovieModel } from "../../models/watchList";
import React, { useEffect, useState } from "react";
import * as DB from "../../src/watchListSQL";
import { FontText } from "../fontText";
import Colors from "../../src/style";

interface WatchListProps {
  navigation: any;
  list_id:number
}

const WatchList: React.FC<WatchListProps> = ({ navigation, list_id }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    let is_sorted = true
    let index = 0
    data.map((movie) => {
      if (index == movie.movie.list_order) index += 1
      else is_sorted = false
    })
    if (!is_sorted) sort_list(data)
  }, [data])

  const sort_list = async (data) => {
    for (let i = 0; i < data.length; i++) {
      await DB.update_movie_order(data[i].movie.id, i)
    }
  }

  useEffect(() => {
    (async () => {
      const fullList = [];
      const movies = await DB.fetch_movie(list_id)
      for (let i = 0; i < movies.length; i++) {
        const data = await getMasterDetails("movie", movies[i].movie_key)
        fullList.push({movie:movies[i],  data: data});
      }
      fullList.sort((a, b) => a.movie.list_order - b.movie.list_order)
      setData(fullList);
    })();
  }, []);

  const rowRenderer = ({ item, drag, isActive }) => {
    const show = item.data
    const showType = getShowType(show.title)

    return (
      <View style={{marginTop: 10}}>
        <ScaleDecorator activeScale={1.05}>
          <TouchableOpacity onLongPress={drag} style={{ height: 150 }} disabled={isActive} onPress={() => { moveToMovie(showType, show); }}>
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

                  {showType === "tv" && show.seasons && (
                    <FontText fontSize={12} font={"Roboto-Bold"}>
                      {show.seasons.length} Seasons
                    </FontText>
                  )}
                </View>
                <FontText fontSize={12} font={"Roboto-Bold"}>
                  {descriptionFix(show.overview, false, 130).text}
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
        keyExtractor={(item) => item.data.id}
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
