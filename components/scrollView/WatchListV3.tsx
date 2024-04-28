import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from "react-native";
import { baseUrl342, descriptionFix, getShowType, round } from "../../src/helper";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import React, { useEffect, useMemo, useRef, useState } from "react";
import InView from "react-native-component-inview";
import * as DB from "../../src/watchListSQL";
import { FontText } from "../fontText";
import Colors from "../../src/style";
import { ScrollEvent } from "recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView";

interface WatchListProps {
  navigation: any;
  list_id: number;
}
let old_index = 0;

const WatchList: React.FC<WatchListProps> = ({ navigation, list_id }) => {
  const dataProviderMaker = (data: any) => new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);
  const [dragAndDropShow, setDragAndDropShow] = useState(null);
  const [dragAndDrop, setDragAndDrop] = useState(false);
  const [data, setData] = useState([]);

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

  useEffect(() => {
    (async () => {
      const fullList = [];
      const movies = await DB.fetch_movie(list_id);
      for (let i = 0; i < movies.length; i++) {
        movies[i].movie_data = JSON.parse(movies[i].movie_data);
        fullList.push(movies[i]);
      }
      setData(fullList);
    })();
  }, []);

  const moveToMovie = async (type, data) => {
    if (type === "movie") {
      console.log(data.title + ", " + data.id);
      navigation.push("MovieScreen", { jsonObject: data });
    } else {
      console.log(data.name + ", " + data.id);
      navigation.push("TvScreen", { jsonObject: data });
    }
  };

  const drag_drop = (show) => {
    if (dragAndDrop) return 
    
    setDragAndDrop(true)
    console.log("start drag and drop")
    const indexOf = data.findIndex((element) => element.movie_key == show.movie_key)
    data.splice(indexOf + 1, 0, {movie_key: "drop_here"})
    setData([...data, {movie_key: "dummy"}])
  };

  const rowRenderer = (type, data) => {
    if (data.movie_key == "dummy") return
    if (data.movie_key == "drop_here") {
      return <View style={{ height: 10, backgroundColor: "white" }}></View>;
    }

    const show = data.movie_data;
    const showType = getShowType(show.title);
    return (
      <TouchableOpacity
        onPress={() => {
          moveToMovie(showType, show);
        }}
        style={{ height: 150 }}
        onLongPress={() => drag_drop(data)}
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
    );
  };

  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);
  const _layoutProvider = useRef(layoutMaker()).current;

  if (!data.length) return null;


  const get_current_screen_index = (e: ScrollEvent) => {

    const y = e.nativeEvent.contentOffset.y;
    const index = Math.floor(y / 165);

    console.log(dragAndDrop)
    if (index > -1 && index < data.length && old_index != index && dragAndDrop) {
      old_index = index;
      
      const i = data.findIndex((value) => value.movie_key == "drop_here");
    if (i > -1) data.splice(i, 1);
      
      setData([...data.slice(0, index + 2), { movie_key: "drop_here" }, ...data.slice(index + 2)]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RecyclerListView
        layoutProvider={_layoutProvider}
        dataProvider={dataProvider}
        rowRenderer={rowRenderer}
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
  dropView: {
    position: "absolute",
    height: "100%",
    justifyContent: "center",
  },
  dropImg: {
    height: 100,
    width: 75,
    borderRadius: 5,
  },
});

export default WatchList;
