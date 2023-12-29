import { StyleSheet, View, Image, Dimensions, GestureResponderEvent, Animated } from "react-native";
import React, { useEffect, useRef, useState } from "react"
import { baseUrl500, makeURL } from "../src/helper";
import { FontText } from "../components/fontText"
import Colors from "../src/style"

const WIDTH = Dimensions.get("window").width
const ANIM_DURATION = 500
const CARD_STACK = 30

interface MovieTinderProps {

}

interface PosCord { x: number, y: number, radiant: number }

const Card = (props: any) => {
  const animPos = useRef(new Animated.Value(0)).current;
  const animRot = useRef(new Animated.Value(0)).current;

  const animOpacityGreen = useRef(new Animated.Value(0)).current;
  const animOpacityRed = useRef(new Animated.Value(0)).current;

  const [startPos, setStartPos] = useState<PosCord>(null)
  const [likeMovie, setLikeMovie] = useState<string>(null)

  const rotateImg = animRot.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] })

  const touchMove = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX

    const disX = x - startPos.x
    const angle = Math.asin((x - startPos.x) / 500)

    animPos.setValue(disX)
    animRot.setValue(angle * (180 / Math.PI))

    if (angle > 0) animOpacityGreen.setValue(angle)
    else animOpacityRed.setValue(Math.abs(angle))

    if (startPos.x + 100 < x) setLikeMovie("right")
    if (startPos.x - 100 > x) setLikeMovie("left")
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
    props.updateIndex()
    setLikeMovie(null)
    animPos.setValue(0)
    animRot.setValue(0)
  }

  const touchEnd = (event: GestureResponderEvent) => {
    if (likeMovie) {
      props.getNextCard()
      if (likeMovie == "right") {
        startAnim(600, 90, 0, resetCard)
      }
      if (likeMovie == "left") {
        startAnim(-600, -90, 0, resetCard)
      } 
    } else {
      startAnim(0, 0, 0)
    }
  }

  return (
    <View style={styles.card}>
      <Animated.View style={{ transform: [{ translateX: animPos }, { rotate: rotateImg }], }}>

        <Image style={styles.cardImg} source={{ uri: baseUrl500 + props.movie.poster_path }} />
        <Animated.View style={{ position: "absolute", height: "100%", width: "90%", backgroundColor: "#00D68F", borderRadius: 25, opacity: animOpacityGreen }} />
        <Animated.View style={{ position: "absolute", height: "100%", width: "90%", backgroundColor: "#d93b3b", borderRadius: 25, opacity: animOpacityRed }} />

      </Animated.View>
      <View onTouchMove={touchMove} onTouchStart={touchStart} onTouchEnd={touchEnd} style={styles.moveCard}></View>
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
  const [movieList, setMovieList] = useState<any>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [nextCard, setNextCard] = useState<number>(0)

  const animPosition1 = useRef(new Animated.Value(CARD_STACK * 1)).current;
  const animPosition2 = useRef(new Animated.Value(CARD_STACK * 2)).current;
  const animPosition3 = useRef(new Animated.Value(CARD_STACK * 3)).current;
  const animOpacity1 = useRef(new Animated.Value(.7)).current;
  const animOpacity2 = useRef(new Animated.Value(.5)).current;
  const animOpacity3 = useRef(new Animated.Value(0)).current;
  const animWidth1 = useRef(new Animated.Value(WIDTH * .9)).current;
  const animWidth2 = useRef(new Animated.Value(WIDTH * .8)).current;
  const animWidth3 = useRef(new Animated.Value(WIDTH * .7)).current;

  useEffect(() => {
    (async () => setMovieList([movieList, ...(await getMovies(pageNumber)).results]))()
  }, [pageNumber])

  const updateIndex = (i: number) => {
    if (nextCard + 4 < movieList.length) {
      setNextCard(nextCard + 1)
    } else {
      setPageNumber(pageNumber + 1)
      // setNextCard(0)
    }
  }

  const startAnim = (callback = () => { }) => {
    Animated.parallel([
      Animated.timing(animPosition1, { toValue: CARD_STACK * 0, duration: ANIM_DURATION, useNativeDriver: false }),
      Animated.timing(animOpacity1, { toValue: 1, duration: ANIM_DURATION, useNativeDriver: false }),

      Animated.timing(animPosition2, { toValue: CARD_STACK * 1, duration: ANIM_DURATION, useNativeDriver: false }),
      Animated.timing(animOpacity2, { toValue: .7, duration: ANIM_DURATION, useNativeDriver: false }),

      Animated.timing(animPosition3, { toValue: CARD_STACK * 2, duration: ANIM_DURATION, useNativeDriver: false }),
      Animated.timing(animOpacity3, { toValue: .5, duration: ANIM_DURATION, useNativeDriver: false })
    ], { stopTogether: true }).start(() => callback())

  }

  const flowNextCard = () => {
    console.log("start next card")
    startAnim(() => {
      animOpacity1.setValue(.7)
      animOpacity2.setValue(.5)
      animOpacity3.setValue(0)
      animPosition1.setValue(CARD_STACK * 1)
      animPosition2.setValue(CARD_STACK * 2)
      animPosition3.setValue(CARD_STACK * 3)
      animWidth1.setValue(WIDTH * .9)
      animWidth2.setValue(WIDTH * .8)
      animWidth3.setValue(WIDTH * .7)
    })
  }

  if (movieList.length == 0) {
    return <FontText fontSize={23} font={"Roboto-Bold"}>loading</FontText>
  }

  return (
    <View>
      <Animated.View style={{ marginTop: animPosition3, position: "absolute", alignSelf: "center", width: animWidth3 }}>
        <View style={[styles.card]}>
          <View style={[styles.cardImg, styles.blackBack]} />
          <Animated.Image style={[styles.cardImg, { opacity: animOpacity3 }]} source={{ uri: baseUrl500 + movieList[nextCard + 3].poster_path }} />
        </View>
      </Animated.View>

      <Animated.View style={{ marginTop: animPosition2, position: "absolute", alignSelf: "center", width: animWidth2 }}>
        <View style={[styles.card]}>
          <View style={[styles.cardImg, styles.blackBack]} />
          <Animated.Image style={[styles.cardImg, { opacity: animOpacity2 }]} source={{ uri: baseUrl500 + movieList[nextCard + 2].poster_path }} />
        </View>
      </Animated.View>

      <Animated.View style={{ marginTop: animPosition1, position: "absolute", alignSelf: "center", width: animWidth1 }}>
        <View style={[styles.card]}>
          <View style={[styles.cardImg, styles.blackBack]} />
          <Animated.Image style={[styles.cardImg, { opacity: animOpacity1 }]} source={{ uri: baseUrl500 + movieList[nextCard + 1].poster_path }} />
        </View>
      </Animated.View>

      <Card movie={movieList[nextCard]} updateIndex={updateIndex} getNextCard={flowNextCard} />
    </View>
  )
}

export default MovieTinder


const styles = StyleSheet.create({
  container: {

  },
  card: {
    marginTop: 30,
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
  }
})