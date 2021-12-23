import { StyleSheet, View, BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';

import Colors from '../src/style';

import WatchList from '../components/scrollView/watchList';
import { TopBar } from '../components/topBar';

const watchList = ({ navigation }) => {

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

      <View style={{ paddingTop: "4%" }}>

      </View>

      <WatchList navigation={navigation} key={Math.random() + reload} />
    </View>
  );
}

export { watchList }

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
