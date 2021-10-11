import { StyleSheet, View, TouchableOpacity, Text, Animated } from "react-native"
import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';
import React, { useState, useRef, useEffect } from "react"
import ProgressCircle from 'react-native-progress-circle'
import MovieList from '../components/movieList';
import CastList from '../components/castList';
import Colors from '../src/style';

import { saveMovieToWatchList, ifMovieAdded, removeMovie } from "../src/saveLoadWatchList";

const baseUrl = "https://image.tmdb.org/t/p/w500/"
const infoUrl = ["https://api.themoviedb.org/3/movie/", "?api_key=648d096ec16e3f691572593e44644d30&language=en-US"]
const whereToWatch = ["https://api.themoviedb.org/3/movie/", "/watch/providers?api_key=648d096ec16e3f691572593e44644d30"]

const HEADER_MAX_HEIGHT = 240;
const HEADER_MIN_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;


const Movie = ({ route, navigation }) => {
  useEffect(() => { 
    checkMovie()
    loadMovieData()
  }, [])

  checkMovie = async () => { 
    setWatchListText(await ifMovieAdded(object.id) ? "Remove from watchlist" : "Add to watchlist" ) 
  } 
  
  const [object] = useState(route.params.jsonObject)
  const [movieInfo, setMovieInfo] = useState(Object)
  const [toWatch, setToWatch] = useState(Object)
  
  const [movieInfoDone, setMovieInfoDone] = useState(false)
  const [toWatchDone, setToWatchDone] = useState(false)
  
  const [movieScrollHeight, setMovieScrollHeight] = useState(5000)
  const [castScrollHeight, setCastScrollHeight] = useState(5000)

  const [watchListText, setWatchListText] = useState("")
  
  const [screenColor, setInfoColor] = useState(1)
  const scrollY = useRef(new Animated.Value(0)).current;


  const addRemoveMovie = async (movie) => { 
    if(watchListText == "Add to watchlist") {
      await saveMovieToWatchList(movie)
    } else {
      await removeMovie(movie)
    }
    checkMovie()
  }

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const loadMovieData = () => {
    fetch(whereToWatch[0] + object.id + whereToWatch[1])
      .then((res) => res.json())
      .then((newData) => {

        const data = newData.results.US
        if (data == undefined) { setToWatch([{ provider_name: "No providers found" }]) }
        else if ("flatrate_and_buy" in data) { setToWatch(data.flatrate_and_buy) }
        else if ("flatrate" in data) { setToWatch(data.flatrate) }
        else if ("rent" in data) { setToWatch(data.rent) }
        else if ("buy" in data) { setToWatch(data.buy) }

        else { setToWatch([{ provider_name: "No providers found" }]) }
      })
      .catch((error) => console.log(error))
      .finally(() => setMovieInfoDone(true))

    fetch(infoUrl[0] + object.id + infoUrl[1])
      .then((res) => res.json())
      .then((newData) => { setMovieInfo(newData) })
      .catch((error) => alert(error))
      .finally(() => setToWatchDone(true))
  }
  const getBgColor = (button) => { return button == screenColor ? Colors.mainColor : "#4E4E4E" }
  const infoButtons = (button) => { setInfoColor(button) }

  return (
    <View style={styles.container}>
      <Animated.Image style={[styles.mainImg, { transform: [{ translateY: imageTranslateY }] }]} source={{ uri: baseUrl + object.backdrop_path }} />
      <Animated.ScrollView
        contentContainerStyle={{ paddingTop: HEADER_MAX_HEIGHT }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })} >

        <View style={styles.purpleTop} />
        <View style={styles.topFixer}>

          <AutoSizeText fontSize={32} numberOfLines={1} style={[styles.titleText, {marginVertical:object.title.length * 0.3 + 5}]} mode={ResizeTextMode.max_lines}> {object.title} </AutoSizeText>

          <TouchableOpacity style={styles.addButton} onPress={() => {addRemoveMovie(object)}}>
            <View style={styles.movieRating}>
              <ProgressCircle
                percent={object.vote_average * 10}
                radius={22}
                borderWidth={5}
                color={Colors.mainColor}
                bgColor="#fff"
                shadowColor="#fff">
                <Text style={{ fontSize: 17, fontWeight: "bold", color: Colors.mainColor }}>{Math.round(object.vote_average * 10) / 10}</Text>
              </ProgressCircle>
            </View>
            <Text style={styles.addToList}>{watchListText}</Text>
            
          </TouchableOpacity>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.infoBut, { backgroundColor: getBgColor(1) }]} onPress={() => infoButtons(1)}>
              <Text style={styles.rowText}>Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.moviesBut, { backgroundColor: getBgColor(2) }]} onPress={() => infoButtons(2)}>
              <Text style={styles.rowText}>Movies</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.CastBut, { backgroundColor: getBgColor(3) }]} onPress={() => infoButtons(3)}>
              <Text style={styles.rowText}>Cast</Text>
            </TouchableOpacity>
          </View>


          {screenColor == 1 && movieInfoDone && toWatchDone ? (
            <View style={infoStyles.container}>

              <View style={infoStyles.innerContainer}>
                <Text style={infoStyles.description}>Release date</Text>
                <Text style={infoStyles.infoText}>{movieInfo.release_date}</Text>
              </View>

              <View style={infoStyles.innerContainer}>
                <Text style={infoStyles.description}>Description</Text>
                <Text style={infoStyles.infoText}>{object.overview}</Text>
              </View>

              <View style={infoStyles.innerContainer}>
                <Text style={infoStyles.description}>Genres</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {movieInfo.genres.map((genre, key) => {
                    return (<TouchableOpacity key={key} style={infoStyles.genresView}><Text style={infoStyles.genresText}>{genre.name}</Text></TouchableOpacity>)
                  })}
                </View>
              </View>

              <View style={infoStyles.innerContainer}>
                <Text style={infoStyles.description}>Where to watch</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                  {toWatch.map((location, key) => {
                    return (<View key={key} style={infoStyles.toWatchView}><Text style={infoStyles.toWatchText}>{location.provider_name}</Text></View>)
                  })}
                </View>
              </View>

            </View>
          ) : null}

          {screenColor == 2 ? (
            <View style={[styles.ScrollStyles, { height: movieScrollHeight }]}>
              <MovieList list="recommended" id={object.id} navigation={navigation} footerPos={(e) => { setMovieScrollHeight(e.nativeEvent.layout.y) }} />
            </View>
          ) : null}

          {screenColor == 3 ? (
            <View style={[styles.ScrollStyles, { height: castScrollHeight }]}>
              <CastList id={object.id} navigation={navigation} footerPos={(e) => { setCastScrollHeight(e.nativeEvent.layout.y) }}/>
            </View>
          ) : null}

        </View>
      </Animated.ScrollView>

    </View>
  )
}


const infoStyles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignSelf: "center",
    width: "94%"
  },
  innerContainer: {
    marginBottom: 30
  },
  description: {
    color:  Colors.textColor,
    fontSize: 20,
    fontWeight: "bold"
  },
  infoText: {
    color: Colors.textColor,
    marginTop: 0,
    fontSize: 14
  },
  genresView: {
    paddingHorizontal: 15,
    paddingVertical: 3,
    marginRight: 10,
    marginTop: 10,
    borderStyle: "solid",
    borderColor: Colors.mainColor,
    borderWidth: 1,
    borderRadius: 100
  },
  genresText: {
    fontSize: 15,
    color:  Colors.textColor,
  },
  toWatchView: {
    paddingHorizontal: 15,
    paddingVertical: 3,
    marginRight: 10,
    marginTop: 10,
    borderStyle: "solid",
    borderColor: Colors.mainColor,
    borderWidth: 1,
    borderRadius: 100
  },
  toWatchText: {
    fontSize: 13,
    color:  Colors.textColor,
  },
})



const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
  titleText: {
    color: Colors.textColor,
    textAlign: "center",
    fontWeight: "bold",
  },
  mainImg: {
    height: HEADER_MAX_HEIGHT,
    position: 'absolute',
    resizeMode: 'cover',
    right: 0,
    left: 0,
    top: 0,
  },
  purpleTop: {
    backgroundColor: Colors.mainColor,
    height: 3,
  },
  topFixer: {
    backgroundColor: Colors.background,
  },
  addButton: {
    marginRight: "3.33%",
    marginLeft: "3.33%",
    height: 50,
    borderRadius: 100,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: Colors.mainColor,
    flexDirection: "row-reverse"
  },
  movieRating: {
    height: 50,
    width: 50,
    borderRadius: 100,
    backgroundColor: "#fff",
    marginTop: -3,
    marginRight: -3,
    justifyContent: "center",
    alignItems: "center",

  },
  addToList: {
    fontSize: 25,
    justifyContent: "center",
    paddingTop: 4,
    textAlign: "center",
    flex: 1,
    alignSelf: "flex-start",
    fontWeight: "bold",
    color: Colors.textColor
  },
  buttonRow: {
    marginTop: 30,
    flexDirection: "row",
    alignSelf: "center",
    height: 30,
    backgroundColor: "#4E4E4E",
    borderRadius: 100,
  },
  infoBut: {
    width: "31.166%",
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100
  },
  moviesBut: {
    width: "31.166%",
  },
  CastBut: {
    width: "31.166%",
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100
  },
  rowText: {
    color:  Colors.textColor,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  ScrollStyles: {
    flex: 1,
    marginTop: 40,
    width: "100%"
  },
})

export { Movie }