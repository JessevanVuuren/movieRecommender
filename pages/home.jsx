import { StyleSheet, TextInput, TouchableOpacity, View, Text } from 'react-native';
import MovieList from '../components/movieList';
import React from 'react';



const Home = ({ navigation }) => {

  return (

    <View style={styles.container}>
      <View style={styles.mainMenu}>
        <TouchableOpacity style={styles.menuHamburger} onPress={() => navigation.openDrawer()}>
          <Text style={{fontSize:35, color:"#a260f7"}}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuLogo}>
          <Text style={{fontSize:20, color:"#a260f7"}}>Movie Recommender</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuSearch} onPress={() => navigation.navigate("Search")} >
          <Text style={{fontSize:28, color:"#a260f7"}}>🔎</Text>
        </TouchableOpacity>
      </View>



      <MovieList list="popular" id="0" navigation={navigation} />
    </View>
  );
}

export { Home }

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#272727",
    marginTop:22,
    flex:1
  },
  mainMenu:{
    justifyContent:"space-between",
    backgroundColor:"#8226FB",
    alignItems:"center",
    flexDirection:"row",
    height:50,
  },
  menuHamburger:{
    margin:10
  },
  menuLogo:{

  },
  menuSearch:{
    margin:10
  }
});