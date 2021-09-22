import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createDrawerNavigator } from "@react-navigation/drawer"

import { CustomDrawerContent } from "../components/customDrawer"

import { Movie } from "../pages/movieViewer"
import { SettingsPage } from "../pages/settingsPage"
import { watchList } from "../pages/watchListViewer"
import  SearchPage  from "../pages/searchPage"
import { Home } from '../pages/home'

import React from 'react'
import Colors from "./style"

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()


const HomeStackScreen = ({ route, navigator }) => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ drawerStyle: { backgroundColor: Colors.background } }}>
    <Drawer.Screen name="Home" component={Home} options={{ header: () => null }} />
    <Drawer.Screen name="Settings" component={SettingsPage} options={{ header: () => null }} />
    <Drawer.Screen name="watchlist" initialParams={{ params: route.params }} component={watchList} options={{ header: () => null }} />
    <Drawer.Screen name="SearchPage" initialParams={{ params: route.params }} component={SearchPage} options={{ header: () => null }} />

    <Drawer.Screen name="Movies" component={Movie} options={{ header: () => null, drawerLabel: () => null, drawerIcon: () => null, title: null, }} />
  </Drawer.Navigator>
)

export const Routes = ({ }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" >
        <Stack.Screen name="HomeScreen" component={HomeStackScreen} options={{ header: () => null }} />
        <Stack.Screen name="MovieScreen" component={Movie} options={{ header: () => null }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}