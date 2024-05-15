import { FilterOptions } from "../models/filter"
import { Genres } from "../models/genres"
import { ProvidersModel } from "../models/providers"
import { RegionsModel } from "../models/regions"
import { ResponseModel } from "../models/response"
import { TvShowModel } from "../models/tvshow"

export const base_url_342 = "https://image.tmdb.org/t/p/w342"
export const base_url_500 = "https://image.tmdb.org/t/p/w500"
export const base_url_780 = "https://image.tmdb.org/t/p/w780"
export const base_url_ori = "https://image.tmdb.org/t/p/original"

const base_url = "https://api.themoviedb.org/3"

const debug_url = "&api_key=" + process.env.EXPO_API_URL

const option = {
  method:"GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + process.env.EXPO_API_ATA
  }
}

export const get_regions = async (): Promise<RegionsModel[]> => {
  const url = `${base_url}/watch/providers/regions?language=en-US`
  const data = await (await fetch(url, option)).json()
  console.log(url + debug_url)
  return data.results
}

export const get_providers = async (region:string, show_type:string): Promise<ProvidersModel[]> => {
  const url = `${base_url}/watch/providers/${show_type}?language=en-US&watch_region=${region}`
  const data = await (await fetch(url, option)).json()
  console.log(url + debug_url)
  return data.results
}

export const get_filter_results = async (show_type:string, options:FilterOptions, page:number): Promise<ResponseModel> => {
  const url = `${base_url}/discover/${show_type}?with_watch_providers=${options.provider.join("|")}&watch_region=${options.region}&with_genres=${options.genres.join("|")}&page=${page}`
  const data:ResponseModel = await( await fetch(url, option)).json()
  console.log(url + debug_url)
  return data
}

export const genres = async (show_type:string): Promise<Genres[]> => {
  const url = `${base_url}/genre/movie/list?language=en`
  const data = await( await fetch(url, option)).json()
  console.log(url + debug_url)
  return data.genres
}