import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from 'react'

import { Movie } from "../pages/movieViewer"
import { Home } from '../pages/home'




const Stack = createStackNavigator()

export const Routes = ({}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" >
        <Stack.Screen name="Home" component={Home} options={{ header: () => null }} />
        <Stack.Screen name="Movie" component={Movie} options={{ header: () => null }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

