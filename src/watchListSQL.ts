import * as SQLite from "expo-sqlite"
import { MovieModel, WatchListModel } from "../models/watchList"

const database = SQLite.openDatabaseSync('watchList.db');


export const drop_all = async () => {
  await database.getAllAsync(`DROP TABLE movie`)
  return await database.getAllAsync(`DROP TABLE movie`)
}


export const initDatabase = async () => {
  await database.execAsync(`CREATE TABLE IF NOT EXISTS movie (
      id INTEGER PRIMARY KEY,
      watch_list INT,
      list_order INT,
      show_type TEXT,
      movie_key TEXT,
      movie_data TEXT,
      watched BOOLEAN,
      FOREIGN KEY(watch_list) REFERENCES watchList(id) 
    );`
  )

  await database.execAsync(`CREATE TABLE IF NOT EXISTS watchList (
      id INTEGER PRIMARY KEY,
      list_name TEXT,
      list_color TEXT,
      watched_list BOOLEAN
    );`
  )
}

export const store_watchList = async (name, color) => {
  return await database.getAllAsync(`INSERT INTO watchList (list_name, list_color) VALUES (?, ?)`, name, color)
}

export const fetch_watchList = async (): Promise<WatchListModel[]> => {
  const data = await database.getAllAsync(`SELECT ML.*, COUNT(M.id) AS "amount" FROM watchList AS ML LEFT JOIN movie AS M ON ML.id = M.watch_list GROUP BY ML.id;`)
  const list = data.map(element => ({ id: element.id, name: element.list_name, color: element.list_color, amount: element.amount }));

  return list
}

export const update_watchList = async (name, color, id) => {
  return await database.getAllAsync(`UPDATE watchList set list_name = ?, list_color = ? WHERE id = ?;`, name, color, id)
}

export const update_movie_order = async (id, order) => {
  return await database.getAllAsync(`UPDATE movie set list_order = ? WHERE id = ?;`, order, id)
}


export const delete_watchList = async (id) => {
  await database.getAllAsync(`DELETE FROM watchList WHERE id = ?`, id)
  return await database.getAllAsync(`DELETE FROM movie WHERE watch_list = ?`, id)
}

export const fetch_movie = async (id): Promise<MovieModel[]> => {
  const data = await database.getAllAsync(`SELECT * FROM movie WHERE watch_list = ? ORDER BY list_order ASC;`, id)
  const list = data.map(element => ({ id: element.id, movie_data: element.movie_data, watch_list: element.watch_list, list_order: element.list_order, show_type: element.show_type, movie_key: parseInt(element.movie_key) }))

  return list
}

const get_amount_of_movies = async (id) => {
  return await database.getAllAsync(`SELECT COUNT(*) as amount FROM movie WHERE watch_list = ?;`, id)
}

export const store_movie = async (watch_list_id, movie_key, movie_data, show_type) => {
  const default_order = (await get_amount_of_movies(watch_list_id))[0].amount

  const minify_data = {
    id: movie_data.id,
    title: movie_data.title,
    vote_average: movie_data.vote_average,
    overview: movie_data.overview,
    poster_path: movie_data.poster_path,
    name: movie_data.name,
    first_air_date: movie_data.first_air_date,
    release_date: movie_data.release_date
  }

  return await database.getAllAsync(`INSERT INTO movie (watch_list, movie_data, list_order, movie_key, show_type, watched) VALUES (?, ?, ?, ?, ?, ?);`, watch_list_id, JSON.stringify(minify_data), default_order, movie_key, show_type, false)
}

export const check_if_movie_in_list = async (id, movie_key) => {
  const data = await database.getAllAsync(`SELECT 1 FROM movie WHERE watch_list = ? AND movie_key = ?;`, id, movie_key)
  return data.length > 0
}

export const delete_movie = async (watch_list_id, movie_key) => {
  return await database.getAllAsync(`DELETE FROM movie WHERE watch_list = ? AND movie_key = ?`, watch_list_id, movie_key)
}