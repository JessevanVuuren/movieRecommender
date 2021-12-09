import { StyleSheet, View } from 'react-native'
import React, { useState} from 'react'

import MovieListVerticalScroll from '../components/scrollView/MovieListVerticalScroll'
import { TopBar } from '../components/topBar'
import Colors from '../src/style'
import { FontText } from '../components/fontText'



const genrePage = ({ route, navigation }) => {

  const [genre] = useState(route.params.genre)





  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} hambAction={"openD"} />
      <MovieListVerticalScroll id={"genreSearch"} navigation={navigation} component={[]} searchQuery={genre} />
    </View>
  );
}

export { genrePage }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
});