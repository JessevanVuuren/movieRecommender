import { StyleSheet, Text, View, Image, Dimensions, GestureResponderEvent, Animated } from "react-native";
import { baseUrl342, baseUrl500, makeURL } from "../src/helper";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react"
import { FontText } from "../components/fontText"

const WIDTH = Dimensions.get("window").width
const ANIM_DURATION = 500

interface MovieTinderProps {

}

interface PosCord { x: number, y: number, radiant: number }

const Card = (props: any) => {
  const animPos = useRef(new Animated.Value(0)).current;
  const animRot = useRef(new Animated.Value(0)).current;

  const animOpacityGreen = useRef(new Animated.Value(0)).current;
  const animOpacityRed = useRef(new Animated.Value(0)).current;

  const [startPos, setStartPos] = useState<PosCord>(null)
  const [likeMovie, setLikeMovie] = useState<string>("")

  const rotateImg = animRot.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] })

  const touchMove = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX

    const disX = x - startPos.x
    const angle = Math.asin((x - startPos.x) / 500)

    animPos.setValue(disX)
    animRot.setValue(angle * (180 / Math.PI))

    if (angle > 0) animOpacityGreen.setValue(angle)
    else animOpacityRed.setValue(Math.abs(angle))

    if (startPos.x + 100 < x) {
      // console.log("right")
      setLikeMovie("right")
    }

    if (startPos.x - 100 > x) {
      // console.log("left")
      setLikeMovie("left")
    }
  }

  const touchStart = (event: GestureResponderEvent) => {
    setStartPos({ x: event.nativeEvent.locationX, y: event.nativeEvent.locationY, radiant: 0 })
  }

  const touchEnd = (event: GestureResponderEvent) => {
    Animated.timing(animPos, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: false }).start();
    Animated.timing(animRot, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: false }).start();
    Animated.timing(animOpacityGreen, { toValue: 0, duration: ANIM_DURATION, useNativeDriver: false }).start();
    Animated.timing(animOpacityRed, { toValue: 0, duration: 500, useNativeDriver: false }).start();
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

const MovieTinder: React.FC<MovieTinderProps> = props => {
  const [movieList, setMovieList] = useState<any>(undefined)

  useEffect(() => {
    (async () => {
      const popularURL = makeURL({ id: "popular", showType: "movie" }, 1)
      const request = await fetch(popularURL)
      setMovieList(await request.json())
    })()
  }, [])

  if (movieList == undefined) {
    return <FontText fontSize={23} font={"Roboto-Bold"}>loading</FontText>
  }

  return (
    <View>
      <Card movie={movieList.results[0]} />
      {/* {movieList.results.map((movie: any) => Card(movie))} */}
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
    // backgroundColor: "#00000099",
    position: "absolute"
  }
})