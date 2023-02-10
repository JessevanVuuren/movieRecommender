import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { StyleSheet, View, Dimensions, Image, Pressable } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { baseUrl342, baseUrl500 } from "../../src/helper";
import { FontText } from "../fontText";

interface SeasonScrollProps {
  seasons: any;
  fall_back: string;
  navigation: any;
  tv_id: number
}

const SeasonScroll: React.FC<SeasonScrollProps> = ({ seasons, fall_back, navigation, tv_id }) => {
  const [data, setData] = useState([]);

  const _layoutProvider = useRef(layoutMaker()).current;
  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);

  const moveTo = (data) => {
    navigation.push("SeasonScreen", { data: data, tv_id: tv_id, fall_back:fall_back });
  };

  const rowRenderer = (type, data) => {
    if (data.item.episode_count == 0) return;
    return (
      <View style={styles.holder}>
        <Pressable onPress={() => moveTo(data.item)}>
          <Image style={styles.img} source={{ uri: baseUrl500 + (data.item.poster_path ? data.item.poster_path : fall_back) }} />
        </Pressable>
        <Pressable onPress={() => moveTo(data.item)}>
          <FontText fontSize={18} font={"Roboto-Bold"}>
            {data.item.name}
          </FontText>
        </Pressable>
      </View>
    );
  };

  useEffect(() => {
    (async () => {
      const fullList = [];
      for (let i = 0; i < seasons.length; i++) {
        fullList.push({
          type: "NORMAL",
          item: seasons[i],
        });
      }
      setData(fullList);
    })();
  }, []);

  if (!data.length) return null;

  return (
    <View style={{ flex: 1 }}>
      <RecyclerListView isHorizontal={true} layoutProvider={_layoutProvider} dataProvider={dataProvider} rowRenderer={rowRenderer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  holder: {
    height: 270,
    width: 170,
    paddingLeft: Dimensions.get("window").width * 0.04,
  },
  img: {
    height: 230,
    width: 153,
    borderRadius: 10,
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
          dim.width = 170
          dim.height = 270;
          break;
      }
    }
  );

export default SeasonScroll;
