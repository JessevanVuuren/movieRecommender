import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMasterDetails, getShowType } from './helper';


export const saveMovieToWatchList = async (movie) => {
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
  AsyncStorage.multiGet(["hide_disclaimer", "watchList"])
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