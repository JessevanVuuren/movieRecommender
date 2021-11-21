import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { View, StyleSheet, Text } from 'react-native'
import Constants from 'expo-constants';

import * as React from 'react'

import Colors from "../src/style"
import { FontText } from './fontText';

function CustomDrawerContent(props) {

  return (
    <DrawerContentScrollView  {...props}>
      <View style={{backgroundColor:Colors.background}}>
        <View style={styles.header}>

        </View>

        <DrawerItem style={styles.ItemsCard} label={() => <FontText fontSize={16} color={Colors.mainColor} font={"Roboto-Bold"}>Home</FontText>} onPress={() => { props.navigation.navigate('Home') }} />
        {/* <DrawerItem style={styles.ItemsCard} label="Search movie" labelStyle={{ color: Colors.textColor }} onPress={() => { props.navigation.navigate('SearchPage', {number: Math.random() * 1000})}} />
        <DrawerItem style={styles.ItemsCard} label="Genre search" labelStyle={{ color: Colors.textColor }} onPress={() => { props.navigation.navigate('AdvancedSearch', {number: Math.random() * 1000})}} /> */}
        <DrawerItem style={styles.ItemsCard}label={() => <FontText fontSize={16} color={Colors.mainColor} font={"Roboto-Bold"}>My watchlist</FontText>} onPress={() => { props.navigation.navigate('watchlist', {number: Math.random() * 1000}) }} />
        {/* <DrawerItem style={styles.ItemsCard} label="Settings" labelStyle={{ color: Colors.textColor }} onPress={() => { props.navigation.navigate('Settings') }} /> */}

      </View>
    </DrawerContentScrollView>
  );
}

export { CustomDrawerContent }

const styles = StyleSheet.create({
  header: {
    
    height: 50
  },
  ItemsCard: {
    height: 50
  },
});
