import { StyleSheet, View } from 'react-native';
import MovieList from '../components/movieList';
import React from 'react';



const Home = ({ navigation }) => {

  return (

    <View style={styles.container}>
      <MovieList list="popular" id="0" navigation={navigation} />
    </View>
  );
}

export { Home }

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272727",
    flex:1
  },
});