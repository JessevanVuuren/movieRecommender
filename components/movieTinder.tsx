import { StyleSheet, Text, View, Image, Dimensions, GestureResponderEvent, Animated } from "react-native";
import { baseUrl342, baseUrl500, makeURL } from "../src/helper";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react"
import { FontText } from "../components/fontText"

const WIDTH = Dimensions.get("window").width

interface MovieTinderProps {

}

interface PosCord { x: number, y: number, radiant: number }

const Card = (props: any) => {

  const widthAnim = useRef(new Animated.Value(0)).current;

  const [startPos, setStartPos] = useState<PosCord>(null)
  const [cardPosition, setCardPosition] = useState<PosCord>({ x: 0, y: 0, radiant: 0 })
  const [likeMovie, setLikeMovie] = useState<string>("")

  const touchMove = (event: GestureResponderEvent) => {
    const x = event.nativeEvent.locationX
    const y = event.nativeEvent.locationY

    const disX = x - startPos.x
    const angle = Math.asin(cardPosition.x / 500)
    setCardPosition({ x: disX, y: 0, radiant: angle })
    widthAnim.setValue(disX)


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
    // setCardPosition({ x: 0, y: 0, radiant: 0 })
    Animated.timing(widthAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver:false
    }).start();
  }


  return (
    <View style={styles.card}>
      {/* <Animated.View style={{ transform: [{ translateX: cardPosition.x }, { translateY: cardPosition.y }, { rotate: cardPosition.radiant + "rad" }], }}> */}
      <Animated.View style={{ transform: [{ translateX: widthAnim }, { rotate: cardPosition.radiant + "rad" }], }}>

        <Image style={styles.cardImg} source={{ uri: baseUrl500 + props.movie.poster_path }} />
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(0, 255, 0,1)"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", height: "100%", width: "88%", right: 0, borderBottomRightRadius: 25, borderTopRightRadius: 25, opacity: cardPosition.radiant }}
        />
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255, 0, 0,1)"]}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 1 }}
          style={{ position: "absolute", height: "100%", width: "88%", borderTopLeftRadius: 25, borderBottomLeftRadius: 25, opacity: cardPosition.radiant < 0 ? Math.abs(cardPosition.radiant) : 0 }}
        />

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