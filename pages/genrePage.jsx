import MovieListVerticalScroll from '../components/scrollView/MovieListVerticalScroll'
import MovieOrSeries from '../components/MovieOrSeries'
import { useGlobalState } from '../global/state'
import { StyleSheet, View } from 'react-native'
import { TopBar } from '../components/topBar'
import React, { useState} from 'react'
import Colors from '../src/style'




const GenrePage = ({ route, navigation }) => {

  const [genre] = useState(route.params.genre)

  return (
    <View style={styles.container}>
      <TopBar navigation={navigation} hambAction={"openD"} />
      <MovieListVerticalScroll id={"genreSearch"} navigation={navigation} component={[]} searchQuery={genre} showType={route.params.showType} />
    </View>
  );
}

export { GenrePage }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1
  },
});