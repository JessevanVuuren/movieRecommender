import { createDrawerNavigator } from "@react-navigation/drawer"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import { CustomDrawerContent } from "../components/customDrawer"

import { SettingsPage } from "../pages/settingsPage"
import { watchList } from "../pages/watchListViewer"
import { ActorPage } from "../pages/ActorPage"
import { genrePage } from "../pages/genrePage"
import { Movie } from "../pages/movieViewer"
import { Home } from '../pages/home'

// import  AdvancedSearch  from "../pages/advancedSearch"
import { SearchPage } from "../pages/SearchPage"

import Colors from "./style"
import React from 'react'

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()


const HomeStackScreen = ({ route, navigator }) => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ drawerStyle: { backgroundColor: Colors.background } }}>
    <Drawer.Screen name="Home" component={Home} options={{ header: () => null }} />
    <Drawer.Screen name="Settings" component={SettingsPage} options={{ header: () => null }} />
    <Drawer.Screen name="watchlist" initialParams={{ params: route.params }} component={watchList} options={{ header: () => null }} />


    {/* <Drawer.Screen name="Movies" component={Movie} options={{ header: () => null, drawerLabel: () => null, drawerIcon: () => null, title: null, }} /> */}
    {/* <Drawer.Screen name="AdvancedSearch" initialParams={{ params: route.params }} component={AdvancedSearch} options={{ header: () => null }} /> */}
    {/* <Drawer.Screen name="Actor" component={Actor} options={{ header: () => null, drawerLabel: () => null, drawerIcon: () => null, title: null, }} /> */}
  </Drawer.Navigator>
)

export const Routes = ({ }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen" >
        <Stack.Screen name="HomeScreen" component={HomeStackScreen} options={{ header: () => null }} />
        <Stack.Screen name="MovieScreen" component={Movie} options={{ header: () => null }} />
        <Stack.Screen name="SearchScreen" component={SearchPage} options={{ header: () => null }} />
        <Stack.Screen name="GenrePage" component={genrePage} options={{ header: () => null }} />
        <Stack.Screen name="ActorPage" component={ActorPage} options={{ header: () => null }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}