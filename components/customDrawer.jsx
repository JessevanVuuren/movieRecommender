import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { View, StyleSheet, Text } from 'react-native'

import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";

import Colors from "../src/style"

function CustomDrawerContent(props) {

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ backgroundColor: Colors.background }}>
        <View style={styles.header}></View>

        <DrawerItem
          style={styles.ItemsCard}
          label={() => <Ionicons style={{ color: Colors.textColor, width: 100, marginLeft: -3 }} name="arrow-back" size={43} />}
          onPress={() => {
            props.navigation.navigate("Home");
          }}
        />

        <DrawerItem
          style={styles.ItemsCard}
          label={() => <FontAwesome style={{ color: Colors.textColor, width: 100 }} name="home" size={35} />}
          onPress={() => {
            props.navigation.navigate("Home");
          }}
        />

        <DrawerItem
          style={styles.ItemsCard}
          label={() => <FontAwesome style={{ color: Colors.textColor, width: 100 }} name="search" size={35} />}
          onPress={() => {
            props.navigation.navigate("SearchScreen");
          }}
        />

        <DrawerItem
          style={styles.ItemsCard}
          label={() => <MaterialIcons style={{ color: Colors.textColor, width: 100, marginLeft: -5 }} name="playlist-play" size={50} />}
          onPress={() => {
            props.navigation.navigate("watchlist");
          }}
        />

        {/* <DrawerItem style={styles.ItemsCard} label={() => <FontText fontSize={16} color={Colors.mainColor} font={"Roboto-Bold"}>Home</FontText>} onPress={() => { props.navigation.navigate('Home') }} />
        <DrawerItem style={styles.ItemsCard} label={() => <FontText fontSize={16} color={Colors.mainColor} font={"Roboto-Bold"}>Search Movie</FontText>} onPress={() => { props.navigation.navigate('SearchScreen') }} />
        <DrawerItem style={styles.ItemsCard}label={() => <FontText fontSize={16} color={Colors.mainColor} font={"Roboto-Bold"}>My watchlist</FontText>} onPress={() => { props.navigation.navigate('watchlist', {number: Math.random() * 1000}) }} /> */}
      </View>
    </DrawerContentScrollView>
  );
}

export { CustomDrawerContent }

const styles = StyleSheet.create({
  header: {
    height: 0,
  },
  ItemsCard: {
    flex:1,
    width:"100%",
    justifyContent:"center"
  }
});
