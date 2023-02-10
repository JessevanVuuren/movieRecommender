import { StyleSheet, View, Image, Dimensions, Pressable, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { baseUrl780, baseUrlOri, getShowType, makeURL } from "../../src/helper";
import React, { useEffect, useRef, useState } from "react";
import { FontText } from "../fontText";
import Colors from "../../src/style";

interface CarouselBannerProps {
  navigation:any
}

const width = Dimensions.get("screen").width;
const listLength = 5;

const BannerImage = (item: any) => {
  const moveToMovie = async (type, data) => {
    if (type === "movie") {
      console.log(data.title + ", " + data.id);
      item.navigation.push("MovieScreen", { jsonObject: data });
    } else {
      console.log(data.name + ", " + data.id);
      item.navigation.push("TvScreen", { jsonObject: data });
    }
  };


  return (
    <TouchableOpacity style={styles.banner} onPress={() => {moveToMovie(getShowType(item.item.title), item.item)}}>
      <View style={styles.cartHolder}>
        <View style={styles.imgHolder}>
          <Image style={styles.img} source={{ uri: baseUrl780 + item.item.backdrop_path }} />
        </View>
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(3, 7, 30,1)"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, height: 80, width: "100%", marginTop: -80 }}
        />

        <View style={styles.textHolder}>
          <View style={{ top: 0 }}>
            <FontText fontSize={15} font={"Roboto-Bold"}>
              {getShowType(item.item.title) === "movie" ? item.item.title : item.item.name}
            </FontText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CarouselBanner: React.FC<CarouselBannerProps> = (props) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [state, setState] = useState(0);
  const [data, setData] = useState([]);

  const scroll = useRef<ScrollView>();
  const interval = useRef<any>();

  const change = ({ nativeEvent }) => {
    const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    setState(slide);
  };

  const paging = () => {
    const list = [];
    for (let i = 0; i < listLength; i++) list.push(i);
    return list.map((i) => {
      return <View style={[styles.page, { backgroundColor: i === state ? Colors.mainColor : Colors.darkLight }]} key={i + " "}></View>;
    });
  };

  useEffect(() => {
    (async () => {
      console.log(props.navigation)
      const url = makeURL({ id: "trending", showType: "all" }, 0);
      const json = await fetch(url);
      const list = await json.json();
      setData(list.results.slice(0, listLength));
    })();
  }, []);

  useEffect(() => {
    if (autoScroll) {
      let stepValue = state;
      interval.current = setInterval(() => {
        if (stepValue + 1 > listLength) stepValue = 0;
        scroll.current.scrollTo({ x: width * stepValue, y: 0 });
        stepValue += 1;
      }, 4000);
    } else {
      clearInterval(interval.current);
      setTimeout(() => {
        setAutoScroll(true);
      }, 5000);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [autoScroll]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scroll}
        horizontal
        onScrollBeginDrag={() => setAutoScroll(false)}
        onScroll={change}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {data.map((e) => (
          <BannerImage item={e} navigation={props.navigation} key={e.id} />
        ))}
      </ScrollView>

      <View style={styles.pagerHolder}>
        <View style={styles.pager}>{paging()}</View>
      </View>
    </View>
  );
};

export default CarouselBanner;

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 5,
  },
  img: {
    height: 720 * (width / 1280),
    borderRadius: 10,
    width: width - (width / 100) * 8,
  },
  imgHolder: {
    alignItems: "center",
    width: width,
  },
  cartHolder: {
    height: 720 * (width / 1280),
  },
  textHolder: {
    position: "absolute",
    bottom: 0,
    marginLeft: 30,
  },
  banner: {},
  pagerHolder: {
    marginTop: 10,
    alignItems: "center",
  },
  pager: {
    flexDirection: "row",
    width: 10 * 2 * listLength,
    justifyContent: "space-between",
  },
  page: {
    height: 10,
    width: 10,
    borderRadius: 100,
  },
});
