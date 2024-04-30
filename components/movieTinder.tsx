import { StyleSheet, View, Image, Dimensions, GestureResponderEvent, Animated, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { baseUrl500, getDate, getMasterDetails, makeURL } from "../src/helper"
import React, { useEffect, useRef, useState } from "react"
import { FontText } from "../components/fontText"
import { MovieModel } from "../models/movie"
import { Movie } from "../pages/movieViewer"
import Modal from "react-native-modal"
import Colors from "../src/style"
import { ROOM } from "../models/room"


const WIDTH = Dimensions.get("window").width
const ANIM_DURATION = 500

const animValues = [
  { position: 0, opacity: .6, width: 1 },
  { position: 0, opacity: 0, width: 1 }
]

interface MovieTinderProps {
  navigation: any;
  route: any;
  room: ROOM;
  send_preference: (movie: MovieModel, preference: string) => void;
}

interface PosCord { x: number, y: number, radiant: number }

const Card = (props: any) => {
  const animPos = useRef(new Animated.Value(0)).current;
  const animRot = useRef(new Animated.Value(0)).current;

  const animOpacityGreen = useRef(new Animated.Value(0)).current;
  const animOpacityRed = useRef(new Animated.Value(0)).current;

  const [startPos, setStartPos] = useState<PosCord>(null)
  const [likeMovie, setLikeMovie] = useState<string>(null)

  const [currentAngle, setCurrentAngle] = useState(0)

  const rotateImg = animRot.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] })

  const touchMove = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX

    const disX = x - startPos.x
    const angle = Math.asin((x - startPos.x) / 500)
    setCurrentAngle(angle)

    animPos.setValue(disX)
    animRot.setValue(angle * (180 / Math.PI))

    if (angle > 0) animOpacityGreen.setValue(angle)
    else animOpacityRed.setValue(Math.abs(angle))

    if (startPos.x + 100 < x) setLikeMovie("wanted")
    if (startPos.x - 100 > x) setLikeMovie("unwanted")
    if (Math.abs(angle) < 0.28) setLikeMovie(null)
  }

  const touchStart = (event: GestureResponderEvent) => {
    setStartPos({ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY, radiant: 0 })
  }

  const startAnim = (pos: number, rot: number, opacity: number, callback = () => { }) => {
    Animated.parallel([
      Animated.timing(animPos, { toValue: pos, duration: ANIM_DURATION, useNativeDriver: false }),
      Animated.timing(animRot, { toValue: rot, duration: ANIM_DURATION, useNativeDriver: false }),
      Animated.timing(animOpacityGreen, { toValue: opacity, duration: ANIM_DURATION, useNativeDriver: false }),
      Animated.timing(animOpacityRed, { toValue: opacity, duration: ANIM_DURATION, useNativeDriver: false }),
    ], { stopTogether: true }).start(() => callback())
  }

  const resetCard = () => {
    props.updateMovie(likeMovie)
    setLikeMovie(null)
    animPos.setValue(0)
    animRot.setValue(0)
    setCurrentAngle(0)
  }

  const touchEnd = (event: GestureResponderEvent) => {
    if (likeMovie) {
      props.getNextCard()
      if (likeMovie == "wanted") {
        startAnim(600, 90, 0, resetCard)
      }
      if (likeMovie == "unwanted") {
        startAnim(-600, -90, 0, resetCard)
      }
    } else {
      startAnim(0, 0, 0, () => setCurrentAngle(0))
    }
  }

  return (
    <View style={styles.card}>
      <Animated.View style={{ transform: [{ translateX: animPos }, { rotate: rotateImg }], }}>
        <TouchableOpacity onPressOut={() => { if (currentAngle == 0) props.showMovie() }} activeOpacity={1}>
          <Image style={styles.cardImg} source={{ uri: baseUrl500 + props.movie.poster_path }} />
        </TouchableOpacity>
        <Animated.View style={{ position: "absolute", height: "100%", width: "90%", backgroundColor: "#00D68F", borderRadius: 25, opacity: animOpacityGreen }} />
        <Animated.View style={{ position: "absolute", height: "100%", width: "90%", backgroundColor: "#d93b3b", borderRadius: 25, opacity: animOpacityRed }} />

      </Animated.View>
      <View onTouchMove={touchMove} onTouchStart={touchStart} onTouchEnd={touchEnd} style={styles.moveCard}></View>
    </View>
  )
}

const ExtraInfo = (props: any) => {
  const movie: MovieModel = props.movie


  return (
    <View style={styles.extraInfoContainer}>
      <View style={styles.infoHolder}>
        <View style={styles.infoRow}>
          <View style={styles.info}>
            <FontText fontSize={20} font={"Roboto-Bold"}>{getDate(movie.release_date)}</FontText>
          </View>
          <View style={[styles.info, styles.movieRating]}>
            <Image source={require("../assets/star-symbol.png")} style={[styles.topStar, { height: 15.5, width: 16 }]} />
            <Text style={styles.voteAverage}>{Math.round(movie.vote_average * 100) / 100}</Text>
          </View>
        </View>
      </View>

    </View>
  )

}

const getMovies = async (page: number) => {
  const popularURL = makeURL({ id: "popular", showType: "movie" }, page)
  console.log(popularURL)
  const request = await fetch(popularURL)
  return await request.json();
}

const MovieTinder: React.FC<MovieTinderProps> = props => {
  const [likedMovies, setLikedMovies] = useState<string[]>([])
  const [movieList, setMovieList] = useState<MovieModel[]>([])
  const [showModel, setShowModel] = useState<boolean>(false)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [nextCard, setNextCard] = useState<number>(0)

  const animArray = []

  for (let i = 0; i < animValues.length; i++) {
    animArray.push({
      position: useRef(new Animated.Value(animValues[i].position)).current,
      opacity: useRef(new Animated.Value(animValues[i].opacity)).current,
      width: useRef(new Animated.Value(animValues[i].width)).current
    })
  }

  useEffect(() => {
    (async () => setMovieList([...movieList, ...(await getMovies(pageNumber)).results]))()
  }, [pageNumber])

  const updateMovie = (preference: string) => {
    setLikedMovies([...likedMovies, movieList[nextCard].id.toString()])
    props.send_preference(movieList[nextCard], preference)
    setNextCard(nextCard + 1)
    if (nextCard + animArray.length + 3 > movieList.length) {
      setPageNumber(pageNumber + 1)
    }
  }

  const startAnim = (callback = () => { }) => {

    const cards = [
      Animated.timing(animArray[0].position, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: false }),
      Animated.timing(animArray[0].opacity, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: false }),
      Animated.timing(animArray[0].width, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: false }),
    ]
    for (let i = 1; i < animValues.length; i++) {
      cards.push(...[
        Animated.timing(animArray[i].position, { toValue: animValues[i - 1].position, duration: ANIM_DURATION, useNativeDriver: false }),
        Animated.timing(animArray[i].opacity, { toValue: animValues[i - 1].opacity, duration: ANIM_DURATION, useNativeDriver: false }),
        Animated.timing(animArray[i].width, { toValue: animValues[i - 1].width, duration: ANIM_DURATION, useNativeDriver: false })
      ])
    }

    Animated.parallel(cards, { stopTogether: true }).start(() => callback())

  }

  useEffect(() => {
    (async () => {

      const array = props.room.payload.wanted_list.filter((e) => {
        return likedMovies.indexOf(e) < 0
      })


      for (let i = 0; i < movieList.length; i++) {
        const movie = movieList[i]

        for (let j = 0; j < props.room.payload.unwanted_list.length; j++) {
          const unwanted = props.room.payload.unwanted_list[j];
          if (movie.id.toString() == unwanted) {
            console.log("remove: ", movie.id.toString())
            movieList.splice(i, 1)
          }
        }
      }

      for (let i = 0; i < array.length; i++) {
        const data: MovieModel = await getMasterDetails("movie", array[i])
        movieList.splice(nextCard + 2 + i, 0, data)
        setLikedMovies([...likedMovies, array[i]])
      }

    })()
  }, [props.room])

  const flowNextCard = () => {
    startAnim(() => {
      for (let i = 0; i < animValues.length; i++) {
        animArray[i].opacity.setValue(animValues[i].opacity)
        animArray[i].position.setValue(animValues[i].position)
        animArray[i].width.setValue(animValues[i].width)
      }
    })
  }

  if (movieList == undefined || movieList.length == 0) {
    return <FontText fontSize={23} font={"Roboto-Bold"}>loading</FontText>
  }

  return (
    <View style={styles.container}>

      {animArray.map((anim, index) =>
        <Animated.View key={index}
          style={{ marginTop: animArray[animArray.length - index - 1].position, position: "absolute", alignSelf: "center" }}>
          <View style={[styles.card]}>
            <View style={[styles.cardImg, styles.blackBack]} />
            <Animated.Image
              style={[styles.cardImg, { opacity: animArray[animArray.length - index - 1].opacity, transform: [{ scaleX: animArray[animArray.length - index - 1].width }] }]}
              source={{ uri: baseUrl500 + movieList[nextCard + animArray.length - index].poster_path }} />
          </View>
        </Animated.View>
      )}

      <Card movie={movieList[nextCard]} updateMovie={updateMovie} getNextCard={flowNextCard} showMovie={() => setShowModel(true)} />

      <ExtraInfo movie={movieList[nextCard]} />

      <Modal isVisible={showModel} onBackButtonPress={() => setShowModel(false)} onBackdropPress={() => setShowModel(false)} >
        <Movie navigation={props.navigation} route={props.route} movie={movieList[nextCard]} ModelMode callback={() => setShowModel(false)} />
      </Modal>
    </View>
  )
}

export default MovieTinder


const styles = StyleSheet.create({
  container: {
  },
  card: {
    paddingTop: 30,
    alignItems: "center",
  },
  cardImg: {
    borderRadius: 25,
    width: WIDTH * .9,
    height: 1170 * (WIDTH * .9 / 780),
  },
  moveCard: {
    height: 1170 * (WIDTH * .9 / 780),
    width: WIDTH,
    position: "absolute"
  },
  blackBack: {
    position: "absolute",
    backgroundColor: Colors.background
  },
  extraInfoContainer: {
    marginTop: 40,
    width: WIDTH * .9,
    alignSelf: "center",
  },
  infoHolder: {

  },
  infoRow: {
    justifyContent: "space-between",
    flexDirection: "row"
  },
  info: {
    justifyContent: "center",
    alignItems: "center",
    width: WIDTH / 2 * .8,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.darkLight
  },
  movieRating: {
    flexDirection: "row",
  },
  voteAverage: {
    color: Colors.textColor,
    fontSize: 20,
    fontWeight: "bold"
  },
  topStar: {
    marginTop: 3,
    marginRight: 5,
  },
})