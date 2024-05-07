import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { base_url_342, get_filter_results } from "../../src/fetcher";
import { Dimensions, StyleSheet, View, Image, NativeModules } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import React, { useEffect, useRef, useState } from "react"
import { getMasterDetails } from "../../src/helper";
import { FilterOptions } from "../../models/filter";

interface ShowScrollerProps {
  filter_options: FilterOptions
  navigation: any;
  show_type: string
}

const calculate_padding = (percent) => {
  const percentOf = (Dimensions.get("window").width / 100) * percent;
  return Math.ceil(percentOf);
}

const calculate_image_size = () => {
  const widthOri = 342;
  const heightOri = 513;
  const imgWidth = Dimensions.get("window").width / 3 - calculate_padding(5);

  const percentDec = ((widthOri - imgWidth) / widthOri) * 100;
  const newHeight = heightOri - (heightOri / 100) * percentDec;

  return { width: imgWidth, height: newHeight };
}


const ShowScroller: React.FC<ShowScrollerProps> = props => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [options, setOptions] = useState<FilterOptions>()
  const [movieList, setMovieList] = useState([])
  const image_size = calculate_image_size()

  useEffect(() => { {
    setMovieList([])
    setCurrentPage(1)
    setOptions(props.filter_options)
  } }, [props.filter_options, props.show_type])
  
  useEffect(() => {
    if (options == undefined) return
    if (options.provider.length == 0) {
      setMovieList([])
      return
    }
    
    setup(options, currentPage)
  }, [options, currentPage])


  const layoutMaker = () =>
    new LayoutProvider(
      (index) => "NORMAL",
      (type, dim) => {
        switch (type) {
          case "NORMAL":
            dim.width = (Dimensions.get("window").width - calculate_padding(4)) / 3;
            dim.height = image_size.height + calculate_padding(3.5);
            break;
        }
      }
    );

  const _layoutProvider = useRef(layoutMaker()).current;

  const setup = async (options: FilterOptions, page:number) => {
    console.log(options)
    const data = await get_filter_results(props.show_type, options, page)
    const newMovieList = data.results.map((e) => ({ type: "NORMAL", item: e }))
    setMovieList([...movieList, ...newMovieList])
  }

  const fetch_new_shows = async () => {
    console.log("new movie page: " + (currentPage + 1))
    setCurrentPage(currentPage + 1)
  }

  const moveToMovie = async (key) => {
    if (props.show_type === "movie") {
      const data = await getMasterDetails("movie", key)
      props.navigation.push("MovieScreen", { jsonObject: data });
    } else {
      const data = await getMasterDetails("tv", key)
      props.navigation.push("TvScreen", { jsonObject: data });
    }
  };


  const row_renderer = (type, data) => {
    return (
      <View style={styles.listItem}>
        <TouchableOpacity onPress={() => { moveToMovie(data.item.id) }}>
          <Image style={[styles.img, { width: image_size.width, height: image_size.height }]} source={{ uri: base_url_342 + data.item.poster_path }} />
        </TouchableOpacity>
      </View>
    )
  }

  if (!movieList.length) return null;

  return (
    <View style={styles.container}>
      <RecyclerListView
        rowRenderer={row_renderer}
        dataProvider={new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(movieList)}
        layoutProvider={_layoutProvider}
        onEndReached={fetch_new_shows}
        onEndReachedThreshold={300}
        renderFooter={() => {
          return <View style={{ width: Dimensions.get("window").width * 0.04 }}></View>;
        }}
      />
    </View>
  )
}

export default ShowScroller


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    marginTop: 10,
    marginLeft: "12.3%",
  },
  img: {
    borderRadius: 10,
  },
})