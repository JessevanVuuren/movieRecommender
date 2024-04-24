export interface WatchListModel {
  id: number,
  name:string,
  color:string,
  amount: number
}

export interface MovieModel {
  id: number,
  movie_data: string,
  watch_list: number,
  list_order: number,
  show_type: number,
  movie_key: string
}