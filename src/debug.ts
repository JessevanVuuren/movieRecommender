import { WatchListModel } from "../models/watchList";
import * as DB from "../src/watchListSQL";
import { getMasterDetails } from "./helper";

const list = ["823464", "1011985", "929590", "359410", "1125311", "560016", "601796", "693134", "856289", "964877", "967847", "634492", "763215", "278", "857655", "618588", "935271", "824016", "624091", "1044741"]

export const fill_with_test = async () => {
  const watch:WatchListModel[] = await DB.fetch_watchList()
  watch.map(async e => {
    if (e.name.includes("debug") && e.amount == 0) {
      const number = parseInt(e.name.split(":")[1])
      await do_movies(e, number, false)
    }

    if (e.name.includes("limit") && e.amount == 0) {
      const number = parseInt(e.name.split(":")[1])
      await do_movies(e, number, true)
      console.log("movies: " + number)
    }
  })
}


const do_movies = async (e:any, number:number, repeat:boolean) => {
  if (repeat) {
    const data = await getMasterDetails("movie", list[0])
    for (let i = 0; i < number; i++) {
      await DB.store_movie(e.id, list[0], JSON.stringify(data), "movie") 
    }
  }
  else {
    for (let i = 0; i < number; i++) {
      if (i >= number) break
  
      const data = await getMasterDetails("movie", list[i])
      await DB.store_movie(e.id, list[i], JSON.stringify(data), "movie")  
    }
  }

}