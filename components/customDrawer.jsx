import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, StyleSheet, Image } from 'react-native';
import * as React from 'react';

import Colors from "../src/style"

function CustomDrawerContent(props) {

  return (
    <DrawerContentScrollView {...props}>
      <View>
        <View style={styles.header}>

        </View>
        <DrawerItem style={styles.ItemsCard} label="Home" labelStyle={{ color: Colors.textColor }} onPress={() => { props.navigation.navigate('Home'); }} />
        <DrawerItem style={styles.ItemsCard} label="My watchlist" labelStyle={{ color: Colors.textColor }} onPress={() => { props.navigation.navigate('watchlist', {number: Math.random() * 1000}); }} />
        <DrawerItem style={styles.ItemsCard} label="Settings" labelStyle={{ color: Colors.textColor }} onPress={() => { props.navigation.navigate('Settings'); }} />


      </View>
    </DrawerContentScrollView>
  );
}

export { CustomDrawerContent }

const styles = StyleSheet.create({
  header: {
    height: 100
  },
  ItemsCard: {
    height: 50
  },
});
