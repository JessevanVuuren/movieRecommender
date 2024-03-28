export interface WatchListModel {
  id: number,
  name:string,
  color:string,
  amount: number
}

export interface MovieModel {
  id: number,
  watch_list: number,
  list_order: number,
  movie_key: string
}