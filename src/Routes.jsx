import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import { createDrawerNavigator } from "@react-navigation/drawer"

import React from 'react'

import { Movie } from "../pages/movieViewer"
import { Settings } from "../pages/settings"
import { Search } from "../pages/search"
import { Home } from '../pages/home'







const Stack = createStackNavigator()


const Drawer = createDrawerNavigator()

const HomeStackScreen = ({navigator}) => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={Home} options={{ header: () => null }} />
    <Drawer.Screen name="Settings" component={Settings} options={{ header: () => null }} />
    <Drawer.Screen name="Search" component={Search} options={{ header: () => null }} />
    <Drawer.Screen name="Movies" component={Movie} options={{ header: () => null, drawerLabel: () => null, drawerIcon: () => null, title: null,}} />
  </Drawer.Navigator>
)

export const Routes = ({}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" >
        <Stack.Screen name="HomeScreen" component={HomeStackScreen} options={{ header: () => null }} />
        <Stack.Screen name="MovieScreen" component={HomeStackScreen} options={{ header: () => null }} />
        <Stack.Screen name="SearchScreen" component={HomeStackScreen} options={{ header: () => null }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
