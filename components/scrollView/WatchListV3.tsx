import { ScrollEvent } from "recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView";
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from "react-native";
import { baseUrl342, descriptionFix, getMasterDetails, getShowType, round } from "../../src/helper";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as DB from "../../src/watchListSQL";
import { FontText } from "../fontText";
import Colors from "../../src/style";

interface WatchListProps {
  navigation: any;
  list_id: number
}

const WatchList: React.FC<WatchListProps> = ({ navigation, list_id }) => {
  const dataProviderMaker = (data: any) => new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);
  const [dragAndDropShow, setDragAndDropShow] = useState<any>();
  const [dragAndDrop, setDragAndDrop] = useState(false);
  const [realLength, setRealLength] = useState(0)
  const [data, setData] = useState([])

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

  useEffect(() => navigation.addListener('focus', () => get_all_movies()), []);

  const moveToMovie = async (type, key) => {
    if (type === "movie") {
      const data = await getMasterDetails("movie", key)
      navigation.push("MovieScreen", { jsonObject: data });
    } else {
      const data = await getMasterDetails("tv", key)
      navigation.push("TvScreen", { jsonObject: data });
    }
  };

  const drag_drop = (show) => {
    if (dragAndDrop) return
    const indexOf = data.findIndex((element) => element.movie_key == show.movie_key)
    setDragAndDropShow(data[indexOf])
    data[indexOf] = { movie_key: "drop_here" }
    setDragAndDrop(true)
  };

  const drop = async () => {
    setDragAndDrop(false)

    for (let i = 0; i < data.length; i++) {
      if (data[i].movie_key == "drop_here") {
        data[i] = dragAndDropShow
      }
    }

    for (let i = 0; i < data.length; i++) {
      await DB.update_movie_order(data[i].id, i)
    }
    get_all_movies()
  }

  const cancel = () => {
    setDragAndDrop(false)
    get_all_movies()
  }

  const remove = async () => {
    setDragAndDrop(false)
    await DB.delete_movie(list_id, dragAndDropShow.movie_key)
    get_all_movies()
  }

  const get_all_movies = async () => {
    const fullList = [];
    const movies = await DB.fetch_movie(list_id);
    for (let i = 0; i < movies.length; i++) {
      movies[i].movie_data = JSON.parse(movies[i].movie_data);
      fullList.push(movies[i]);
    }

    if (fullList.length < 6) {
      setRealLength(fullList.length)
      fullList.push({ movie_key: "dummy" })
      fullList.push({ movie_key: "dummy" })
      fullList.push({ movie_key: "dummy" })
      fullList.push({ movie_key: "dummy" })
    }
    setData(fullList);
  }

  const rowRenderer = (type, data) => {
    if (data.movie_key == "dummy") return
    if (data.movie_key == "drop_here") {
      return (
        <View style={styles.listItem}>
          <View style={{ alignItems: "flex-start", flex: 1 }}>
            <Image style={styles.img} source={{ uri: baseUrl342 + dragAndDropShow.movie_data.poster_path }} />
          </View>
          <View style={styles.drag_drop_holder}>
            <TouchableOpacity onPress={drop} style={[styles.drag_drop_button, { backgroundColor: Colors.background_highlight, marginBottom: 10 }]}>
              <FontText fontSize={17} font={"Roboto-Bold"}>Drop</FontText>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancel} style={[styles.drag_drop_button, { backgroundColor: Colors.darkLight, marginBottom: 10 }]}>
              <FontText fontSize={17} font={"Roboto-Bold"}>Cancel</FontText>
            </TouchableOpacity>
            <TouchableOpacity onPress={remove} style={[styles.drag_drop_button, { backgroundColor: Colors.dangerRed }]}>
              <FontText fontSize={17} font={"Roboto-Bold"}>Remove</FontText>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    const showType = getShowType(data.movie_data.title);
    return (
      <TouchableOpacity
        onPress={() => {
          moveToMovie(showType, data.movie_key);
        }}
        style={{ height: 150 }}
        onLongPress={() => drag_drop(data)}
      >
        <View style={styles.listItem}>
          <View style={{ alignItems: "flex-start", flex: 1 }}>
            <Image style={styles.img} source={{ uri: baseUrl342 + data.movie_data.poster_path }} />
          </View>

          <View style={{ marginLeft: 110 }}>
            <View style={{ marginBottom: 2 }}>
              <FontText font={"Roboto-Bold"} fontSize={12} numberOfLines={2}>
                {showType === "movie" ? data.movie_data.title : data.movie_data.name}
              </FontText>
            </View>
            <View style={styles.movieRatingRow}>
              <FontText color={Colors.mainColor} font={"Roboto-Bold"} fontSize={12}>
                {showType === "movie" ? data.movie_data.release_date.split("-")[0] : data.movie_data.first_air_date.split("-")[0]}
              </FontText>
              <View style={{ marginLeft: 10, flex: 1 }}>
                <View style={{ flexDirection: "row" }}>
                  <Image source={require("../../assets/star-symbol.png")} style={[styles.topStar, { height: 10, width: 10 }]} />
                  <FontText color={Colors.textColor} font={"Roboto-Bold"} fontSize={12}>
                    {round(data.movie_data.vote_average)}
                  </FontText>
                </View>
              </View>
            </View>
            <FontText fontSize={12} font={"Roboto-Bold"}>
              {descriptionFix(data.movie_data.overview, false, 130).text}
            </FontText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);
  const _layoutProvider = useRef(layoutMaker()).current;

  if (!data.length) return null;


  const get_current_screen_index = (e: ScrollEvent) => {
    const screen_height = e.nativeEvent.layoutMeasurement.height
    const y = e.nativeEvent.contentOffset.y
    const list_height = data.length * 165

    let index = Math.floor(y / 165);
    let index_offset = 2

    if (y < 10) index_offset = 0
    if (y < 100 && y >= 10) index_offset = 1
    if (y < 150 && y > 100) index_offset = 2

    if (y + screen_height > list_height - 100) index_offset = 3
    if (y + screen_height < list_height - 100 && y + screen_height > list_height - 130) index_offset = 2


    if (index > -1 && index < data.length && dragAndDrop) {
      if (data[index + index_offset].movie_key == "dummy") return

      const i = data.findIndex((value) => value.movie_key == "drop_here");
      if (i > -1) data.splice(i, 1);

      setData([...data.slice(0, index + index_offset), { movie_key: "drop_here" }, ...data.slice(index + index_offset)]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RecyclerListView
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={rowRenderer}
        scrollViewProps={{
          showsHorizontalScrollIndicator: true,
        }}
        onScroll={get_current_screen_index}
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
  drag_drop_holder: {
    justifyContent: "center",
    marginRight: 10,
    marginLeft: 110
  },
  drag_drop_button: {
    width: "100%",
    borderRadius: 5,
    height: 42.8,
    justifyContent: "center",

    alignItems: "center",

  }
});

export default WatchList;
