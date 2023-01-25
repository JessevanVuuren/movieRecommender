import { EXPO_API_URL } from '@env'
import { useGlobalState } from '../global/state'

// base url for img // w500 is for quality 
export const baseUrl500 = "https://image.tmdb.org/t/p/w500"
export const baseUrl342 = "https://image.tmdb.org/t/p/w342"
export const baseUrlOri = "https://image.tmdb.org/t/p/original"

// url for info from a movie 
export const infoUrl = ["https://api.themoviedb.org/3/movie/", "?api_key=" + EXPO_API_URL + "&language=en-US"]

// stream provider 
export const whereToWatch = ["https://api.themoviedb.org/3/movie/", "/watch/providers?api_key=" + EXPO_API_URL + "&language=en-US"]

// get cast list
export const getCast = ["https://api.themoviedb.org/3/movie/", "/credits?api_key=" + EXPO_API_URL + "&language=en-US"]

// get videos from movie
export const getVideos = ["https://api.themoviedb.org/3/movie/", "/videos?api_key=" + EXPO_API_URL + "&language=en-US"]


// get more info over actor
export const getActorInfo = ["https://api.themoviedb.org/3/person/", "?api_key=" + EXPO_API_URL + "&language=en-US"]



// get popular 
export const getPopular = ["https://api.themoviedb.org/3/{type}/popular?api_key=" + EXPO_API_URL + "&language=en-US&page="]

//get Upcoming 
export const getUpComing = ["https://api.themoviedb.org/3/{type}/{whenComing}?api_key=" + EXPO_API_URL + "&language=en-US&page="]

//get Top Rated
export const getTopRated = ["https://api.themoviedb.org/3/{type}/top_rated?api_key=" + EXPO_API_URL + "&language=en-US&page="]

// get Now Playing
export const getNowPlaying = ["https://api.themoviedb.org/3/{type}/{whenPlaying}?api_key=" + EXPO_API_URL + "&language=en-US&page="]

// movies based on a movie
export const MatchingMovies = ["https://api.themoviedb.org/3/movie/", "/recommendations?api_key=" + EXPO_API_URL + "&language=en-US&page="]

// user input for specific movie
export const SearchMovie = ["https://api.themoviedb.org/3/search/{type}?api_key=" + EXPO_API_URL + "&language=en-US&query=", "&include_adult=false&page="]

export const GenreMovie = ["https://api.themoviedb.org/3/discover/{type}?api_key=" + EXPO_API_URL + "&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=", "&with_watch_monetization_types=flatrate&page="]



// get all images actor tagged in
export const ActorImgs = ["https://api.themoviedb.org/3/person/", "/tagged_images?api_key=" + EXPO_API_URL + "&language=en-US&page="]
// get all movies a actor played in
export const ActorList = ["https://api.themoviedb.org/3/discover/movie?api_key=" + EXPO_API_URL + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_people=", "&with_watch_monetization_types=flatrate&page="]





// genre List + id
export const genreListMovie = [
    ["Action", 28, 10759],
    ["Adventure", 12, 10759],
    ["Animation", 16],
    ["Comedy", 35],
    ["Crime", 80],
    ["Documentary", 99],
    ["Drama", 18],
    ["Family", 10751],
    ["Fantasy", 14, 10765],
    ["History", 36],
    ["Horror", 27],
    ["Music", 10402],
    ["Mystery", 9648],
    ["Romance", 10749],
    ["Science Fiction", 878],
    ["TV Movie", 10770],
    ["Thriller", 53],
    ["War", 10752, 10768],
    ["Western", 37]
]

// genre List + id
export const genreListTv = [
    ["Action & Adventure", 10759],
    ["Animation", 16],
    ["Comedy", 35],
    ["Crime", 80],
    ["Documentary", 99],
    ["Drama", 18],
    ["Family", 10751],
    ["Kids", 10762],
    ["Mystery", 9648],
    ["News", 10763],
    ["Reality", 10764],
    ["Sci-Fi & Fantasy", 10765],
    ["Soap", 10766],
    ["Talk", 10767],
    ["War & Politics", 10768],
    ["Western", 37]
]
// the cooler list + id
export const genreDict = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western", }





export const round = (num) => {
    num = Math.round(num + "e" + 1)
    return Number(num + "e" + -1)
}


// get date 
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
export const getDate = (raw_date) => {
    if (raw_date == undefined) return ""
    const date = new Date(raw_date)
    return monthNames[date.getMonth()] + " " + date.getFullYear()
}

export const getActorDate = (object) => {
    if (object == undefined) return ""
    const date = new Date(object)
    return object.split("-")[2] + " " + monthNames[date.getMonth()] + " " + date.getFullYear()
}

export const descriptionFix = (object, toggleDisc, short = 180) => {
    const lengthText = object.length
    let newText = object
    let shortened = false

    if (lengthText > short) shortened = true
    if (lengthText > short && !toggleDisc) {

        newText = newText.padEnd(short).substring(0, short)
        if (newText.slice(newText.length - 1) == " ")
            newText = newText.slice(0, newText.length - 2) + "..."
        else
            newText += "..."
    }

    return { "text": newText, "shortened": shortened }
}


export const makeURL = (props, page) => {
    const type = props.showType
    let url = ""

    switch (props.id) {
        case 'nowPlaying':
            url = getNowPlaying + "1"
            url = url.replace("{whenPlaying}", type === "movie" ? "now_playing" : "airing_today")
            break
        case 'upComing':
            url = getUpComing + "1"
            if (type === "movie") {
                url = url.replace("{whenComing}", "upcoming")
            } else {
                url = url.replace("{whenComing}", "on_the_air")
            }
            break
        case 'topRated':
            url = getTopRated + "1"
            break
        case 'genreSearch':
            url = GenreMovie[0] + props.searchQuery + GenreMovie[1] + page
            break
        case 'popular':
            url = getPopular + page
            break
        case 'search':
            if (props.searchQuery == "") return
            url = SearchMovie[0] + props.searchQuery + SearchMovie[1] + "1"
            break
        case 'actorMovieList':
            url = ActorList[0] + this.props.actorID + ActorList[1] + this.state.pageCount
            break
        default:
            MatchingMovies[0] + props.id + MatchingMovies[1] + "1"
    }
    return url.replace("{type}", type)
}



// https://developers.themoviedb.org/3/tv/get-tv-details




























// documentation
//https://www.themoviedb.org/documentation/api



// black widow 497698
// The Simpsons: The Good, the Bart, and the Loki 846214
// morgen war 588228

// get popular movies = https://api.themoviedb.org/3/movie/popular?api_key=648d096ec16e3f691572593e44644d30&language=en-US&page=1
// recommended movies = https://api.themoviedb.org/3/movie/497698/recommendations?api_key=648d096ec16e3f691572593e44644d30&language=en-US&page=1

// info = https://api.themoviedb.org/3/movie/588228?api_key=648d096ec16e3f691572593e44644d30&language=en-US
// poster = https://image.tmdb.org/t/p/original/xipF6XqfSYV8DxLqfLN6aWlwuRp.jpg
// banner = https://image.tmdb.org/t/p/original/yizL4cEKsVvl17Wc1mGEIrQtM2F.jpg
// get watch loc = https://api.themoviedb.org/3/movie/497698/watch/providers?api_key=648d096ec16e3f691572593e44644d30

// cast = https://api.themoviedb.org/3/movie/588228/credits?api_key=648d096ec16e3f691572593e44644d30&language=en-US
// picture = https://image.tmdb.org/t/p/original/gXKyT1YU5RWWPaE1je3ht58eUZr.jpg


// "backdrop_sizes": [
//   "w300",
//   "w780",
//   "w1280",
//   "original"
// ],
// "logo_sizes": [
//   "w45",
//   "w92",
//   "w154",
//   "w185",
//   "w300",
//   "w500",
//   "original"
// ],
// "poster_sizes": [
//   "w92",
//   "w154",
//   "w185",
//   "w342",
//   "w500",
//   "w780",
//   "original"
// ],
// "profile_sizes": [
//   "w45",
//   "w185",
//   "h632",
//   "original"
// ],
// "still_sizes": [
//   "w92",
//   "w185",
//   "w300",
//   "original"
// ]