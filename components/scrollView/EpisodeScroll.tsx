import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { StyleSheet, View, Dimensions, Text, Image, Pressable, Alert, ToastAndroid } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { baseUrl780, reFormatData, round } from "../../src/helper";
import { FontText } from "../fontText";
import Colors from "../../src/style";

const HEIGHT = 260;
const WIDTH = Dimensions.get("window").width;

interface EpisodeScrollProps {
  episodes: any;
  fall_back: string;
  navigation: any;
  tv_id:number
  season_number:number
}

const EpisodeScroll: React.FC<EpisodeScrollProps> = ({ episodes, fall_back, navigation, tv_id, season_number }) => {
  const [data, setData] = useState([]);
  const _layoutProvider = useRef(layoutMaker()).current;
  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);

  const toGoEpisode = async (episode) => {
    if (!episode.still_path) {
      ToastAndroid.show('No information available yet', ToastAndroid.SHORT);
      return
    }
    console.log(episode.name + ", " + episode.id);
    navigation.push("EpisodeScreen", { data: episode, tv_id: tv_id, season_number: season_number });
  };

  const rowRenderer = (type: string, data: any) => {
    return (
      <View style={styles.container}>
        <View>
          <Pressable onPress={() => toGoEpisode(data.item)}>
            <Image
              style={styles.img}
              source={{ uri: data.item.still_path ? baseUrl780 + data.item.still_path : baseUrl780 + fall_back }}
              resizeMode="contain"
            />
            <View style={styles.title}>
              <FontText fontSize={15} font={"Roboto-Bold"}>
                {data.item.name}
              </FontText>
              {data.item.vote_average > 0 && (
                <View style={styles.vote}>
                  <Image source={require("../../assets/star-symbol.png")} style={[styles.topStar, { height: 12, width: 12 }]} />

                  <FontText fontSize={13} font={"Roboto-Bold"}>
                    {round(data.item.vote_average)}
                  </FontText>
                </View>
              )}
            </View>

            <View style={styles.subTitle}>
              <FontText fontSize={13} font={"Roboto-Bold"} color={Colors.mainColor}>
                {reFormatData(data.item.air_date)}
              </FontText>

              {data.item.still_path && data.item.runtime && (
                <FontText fontSize={13} font={"Roboto-Bold"} color={"gray"}>
                  {data.item.runtime} min
                </FontText>
              )}
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  useEffect(() => {
    (async () => {
      const fullList = [];
      for (let i = 0; i < episodes.length; i++) {
        fullList.push({
          type: "NORMAL",
          item: episodes[i],
        });
      }
      setData(fullList);
    })();
  }, []);

  return (
    <View style={{ width: "100%", height: data.length * HEIGHT }}>
      <RecyclerListView style={{ flex: 1 }} layoutProvider={_layoutProvider} dataProvider={dataProvider} rowRenderer={rowRenderer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
  },
  topStar: {
    marginTop: 4,
    marginRight: 5,
  },
  img: {
    borderRadius: 10,
    marginBottom: 3,
    height: ((WIDTH - (WIDTH / 100) * 8) / 780) * 439,
    width: WIDTH - (WIDTH / 100) * 8,
  },
  title: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: WIDTH - (WIDTH / 100) * 8,
  },
  vote: {
    flexDirection: "row",
  },
  subTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: WIDTH - (WIDTH / 100) * 8,
  },
});

const dataProviderMaker = (data) => new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

const layoutMaker = () =>
  new LayoutProvider(
    (i) => {
      return "NORMAL";
    },
    (type, dim) => {
      switch (type) {
        case "NORMAL":
          dim.width = WIDTH;
          dim.height = HEIGHT;
          break;
      }
    }
  );

export default EpisodeScroll;
