import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMasterDetails, getShowType } from './helper';
import * as DB from "../src/watchListSQL";
import Colors from "../src/style";


export const getAllMovies = async () => {
  const data = JSON.parse(await getMovieToWatchList())["movieList"]
  return data
}


export const removeFullList = async () => {
  await AsyncStorage.setItem('watchList', "[]")
} 

export const migrateDatabase = async () => {
  try {

    const movies = await getAllMovies()
    const watch = await DB.fetch_watchList()
    
    const watchListExists = watch.find(list => list.color == Colors.mainColor)
    if (watchListExists === undefined && movies.length > 0) {
      console.log("no migration yet")
      await DB.initDatabase()
      await DB.store_watchList("watchlist", Colors.mainColor);
      const watchList = await DB.fetch_watchList()
      const list = watchList.find(element => element.color == Colors.mainColor)
      for (let i = 0; i < movies.length; i++) {
        console.log("migrating", movies[i]["movieData"].id)
        await DB.store_movie(list.id, movies[i]["movieData"].id)
      }
      
      console.log("removing list")
      await removeFullList()
    }
  } catch (e) {
    console.log("migration failed")
    console.log(e)
  }
}