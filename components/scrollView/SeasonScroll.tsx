import { StyleSheet, View, Dimensions, Text, Image } from "react-native";
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { baseUrl342, tvEpisodes } from "../../src/helper";
import { FontText } from "../fontText";
import { TouchableOpacity } from "react-native-gesture-handler";

interface SeasonScrollProps {
  seasons: any;
  fall_back: string;
}

const SeasonScroll: React.FC<SeasonScrollProps> = ({ seasons, fall_back }) => {
  const [data, setData] = useState([]);

  const _layoutProvider = useRef(layoutMaker()).current;
  const dataProvider = useMemo(() => dataProviderMaker(data), [data]);

  const rowRenderer = (type, data) => {
    if (data.item.episode_count == 0) return;
    return (
      <View style={styles.holder}>
        <TouchableOpacity onPress={() => console.log("TO => " + data.item.name)}>
          <Image style={styles.img} source={{ uri: baseUrl342 + (data.item.poster_path ? data.item.poster_path : fall_back) }} />
        </TouchableOpacity>
        <FontText fontSize={18} font={"Roboto-Bold"}>
          {data.item.name}
        </FontText>
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
