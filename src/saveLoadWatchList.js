import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DB from "../src/watchListSQL";
import Colors from "../src/style";


import { getMasterDetails, getShowType } from './helper';


export const saveMovieToWatchList = async (id) => {
  const movie = await getMasterDetails("movie", id)

  const listObject = JSON.parse(await getMovieToWatchList())
  const todayDate = new Date(Date.now()).toLocaleString().split(',')[0]

  if (await ifMovieAdded(movie.id)) return

  listObject["movieList"].push({ "movieData": movie, "addedDate": todayDate })
  AsyncStorage.setItem('watchList', JSON.stringify(listObject))
}

export const removeMovie = async (movie) => {
  const list = JSON.parse(await getMovieToWatchList())
  list["movieList"].map((item, index) => {
    if (item["movieData"].id == movie.id) {
      list["movieList"].splice(index, 1)
      console.log("Deleted movie: " + movie.title + " length of list: " + (list["movieList"].length))
    }
  })

  AsyncStorage.setItem('watchList', JSON.stringify(list))
}


export const getMovieToWatchList = async () => {
  var list = await AsyncStorage.getItem('watchList')

  if (!list) {
    console.log("async list empty, make empty object \"movieList: []\"")
    AsyncStorage.setItem('watchList', JSON.stringify({ "movieList": [] }))
    list = []
  }

  return list
};

export const ifMovieAdded = async (id) => {
  const listObject = JSON.parse(await getMovieToWatchList())

  let alreadyExist = false
  if (listObject != null) {
    listObject["movieList"].map(item => {
      if (item["movieData"].id == id) {
        alreadyExist = true
        if (Object.keys(item["movieData"]).length < 25) {
          updateList(listObject, item["movieData"])
        }
      }
    })
  }

  return alreadyExist
}

const updateList = async (list, show) => {
  const showType = getShowType(show.title)
  const data = await getMasterDetails(showType, show.id)

  list["movieList"].map(item => {
    if (item["movieData"].id === show.id) {
      item["movieData"] = data
    }
    return item
  })

  AsyncStorage.setItem('watchList', JSON.stringify(list))
}

export const getAllMovies = async () => {
  const data = JSON.parse(await getMovieToWatchList())["movieList"]
  return data
}


export const removeFullList = async () => {
  await AsyncStorage.setItem('watchList', "")
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
        const show_type = getShowType(movies[i]["movieData"].title)
        const movie_data = await getMasterDetails(show_type, movies[i]["movieData"].id)
        await DB.store_movie(list.id, movies[i]["movieData"].id, movie_data, show_type)
      }
      
      console.log("removing list")
      await removeFullList()
    }
  } catch (e) {
    console.log("migration failed")
    console.log(e)
  }
}