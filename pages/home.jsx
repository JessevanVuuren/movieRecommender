import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import MovieList from '../components/movieList';
import React from 'react';



const Home = ({ navigation }) => {

  return (

    <View style={styles.container}>
      <View style={styles.searchBarView}>
        <Text style={{fontSize:40, marginLeft:8, color:"#a260f7"}}>☰</Text>
        <TextInput style={styles.searchInput} />

      </View>



      <MovieList list="popular" id="0" navigation={navigation} />
    </View>
  );
}

export { Home }

const styles = StyleSheet.create({
  container: {
    marginTop:22,
    backgroundColor: "#272727",
    flex:1
  },
  searchBarView:{
    height:50,
    backgroundColor:"#8226FB",
    justifyContent:"center"
  },
  searchInput:{
    backgroundColor:"#a260f7",
    position:"absolute",
    width:"87%",
    height:35,
    marginLeft:50,
  }
});