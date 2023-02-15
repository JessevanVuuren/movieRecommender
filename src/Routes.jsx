import { createDrawerNavigator } from "@react-navigation/drawer"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import { CustomDrawerContent } from "../components/customDrawer"

import { SettingsPage } from "../pages/settingsPage"
import { WatchListView } from "../pages/watchListViewer"
import { ActorPage } from "../pages/ActorPage"
import { GenrePage } from "../pages/genrePage"
import { Movie } from "../pages/movieViewer"
import { Home } from '../pages/home'

import { SearchPage } from "../pages/SearchPage"

import Colors from "./style"
import TvViewer from "../pages/TvViewer"
import { SeasonViewer } from "../pages/SeasonViewer"
import { EpisodeViewer } from "../pages/EpisodeViewer"

const Drawer = createDrawerNavigator()
const Stack = createStackNavigator()


const HomeStackScreen = ({ route, navigator }) => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{ drawerStyle: { backgroundColor: Colors.background, width: 77 } }}>
    <Drawer.Screen name="Home" component={Home} options={{ header: () => null }} />
    <Drawer.Screen name="Settings" component={SettingsPage} options={{ header: () => null }} />
    <Drawer.Screen name="watchlist" initialParams={{ params: route.params }} component={WatchListView} options={{ header: () => null }} />
  </Drawer.Navigator>
);

export const Routes = ({ }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen name="HomeScreen" component={HomeStackScreen} options={{ header: () => null }} />
        <Stack.Screen name="MovieScreen" component={Movie} options={{ header: () => null }} />
        <Stack.Screen name="TvScreen" component={TvViewer} options={{ header: () => null }} />
        <Stack.Screen name="SearchScreen" component={SearchPage} options={{ header: () => null }} />
        <Stack.Screen name="SeasonScreen" component={SeasonViewer} options={{ header: () => null }} />
        <Stack.Screen name="EpisodeScreen" component={EpisodeViewer} options={{ header: () => null }} />
        <Stack.Screen name="GenrePage" component={GenrePage} options={{ header: () => null }} />
        <Stack.Screen name="ActorPage" component={ActorPage} options={{ header: () => null }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}