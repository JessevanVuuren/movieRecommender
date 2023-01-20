import { StyleSheet, View, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';

import WatchList from '../components/scrollView/WatchList';
import { FontText } from "../components/fontText"
import { TopBar } from '../components/topBar';
import Colors from '../src/style';


const WatchListView = ({ navigation }) => {

  const [reload, setReload] = useState();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      setReload(Math.random())
    });

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>

      <TopBar navigation={navigation} hambAction={"openD"} />



      <View style={{ marginBottom: "4%", marginLeft: "4%", marginTop: "5%" }}>
        <FontText fontSize={22} font={"Roboto-Bold"}>Your Watchlist</FontText>

      </View>

      <WatchList navigation={navigation} key={Math.random() + reload} />
    </View>
  );
}

export { WatchListView }

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    width: "100%",
    flex: 1,
  },

  mainMenu: {
    backgroundColor: Colors.mainColor,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,

  },
  menuHamburger: {
    margin: 10
  },
  menuLogo: {

  },
  menuSearch: {
    margin: 10
  }
});
