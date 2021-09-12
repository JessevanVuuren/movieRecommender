import AsyncStorage from '@react-native-async-storage/async-storage';


export const saveMovieToWatchList = async (movie) => {
  const list = await getMovieToWatchList()
  if(!list) {
    console.log("async list empty, make empty object \"movieList: []\"")
    AsyncStorage.setItem('watchList', JSON.stringify({"movieList": []}))
    return
  }

  const listObject = JSON.parse(list)
  const todayDate = new Date(Date.now()).toLocaleString().split(',')[0]

  if(await ifMovieAdded(movie.id)) {
    console.log("Movie already in watchList")
    return
  }

  console.log("Added: " + movie.title + " to watchList")
  listObject["movieList"].push({"id": movie.id, "title": movie.title, "Date": todayDate})
  AsyncStorage.setItem('watchList', JSON.stringify(listObject))
}

export const removeMovie = async (movie) => {
  const list = JSON.parse(await getMovieToWatchList())
  list["movieList"].map((item, index) => {
    if(item.id == movie.id) {
      console.log("Deleted movie: " + movie.title)
      list["movieList"].splice(index)
    }
  })

  AsyncStorage.setItem('watchList', JSON.stringify(list))
}


export const getMovieToWatchList = () => {
  return AsyncStorage.getItem('watchList')
};

export const ifMovieAdded = async (id) => {
  const listObject = JSON.parse(await getMovieToWatchList())

  let alreadyExist = false
  listObject["movieList"].map(item => { if(item.id == id) alreadyExist = true })
  return alreadyExist
}

export const getAllMovies = async () => {
  const data = JSON.parse(await getMovieToWatchList())["movieList"]
  return data
} 