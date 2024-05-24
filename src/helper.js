import { get_region_form_local } from "./utils"

const EXPO_API_URL = process.env.EXPO_API_URL

// base url for img // w500 is for quality 
export const baseUrl500 = "https://image.tmdb.org/t/p/w500"
export const baseUrl342 = "https://image.tmdb.org/t/p/w342"
export const baseUrl780 = "https://image.tmdb.org/t/p/w780"
export const baseUrlOri = "https://image.tmdb.org/t/p/original"



const trending = "https://api.themoviedb.org/3/trending/{type}/day?api_key=" + EXPO_API_URL

const masterInfoUrl = "https://api.themoviedb.org/3/{type}/{id}?api_key=" + EXPO_API_URL + "&append_to_response=videos,credits,images,recommendations,similar"

// stream provider 
const whereToWatch = ["https://api.themoviedb.org/3/{type}/", "/watch/providers?api_key=" + EXPO_API_URL + "&language=en-US"]

// get cast list
const getCast = "https://api.themoviedb.org/3/{type}/{id}/credits?api_key=" + EXPO_API_URL + "&language=en-US"

// get videos from movie
const getVideos = "https://api.themoviedb.org/3/{type}/{id}/videos?api_key=" + EXPO_API_URL + "&language=en-US"


// get more info over actor
// export const getActorInfo = ["https://api.themoviedb.org/3/person/", "?api_key=" + EXPO_API_URL + "&language=en-US"]
const getActorInfo = "https://api.themoviedb.org/3/person/{person_id}?api_key=" + EXPO_API_URL + "&language=en-US&append_to_response=images"

const similar = "https://api.themoviedb.org/3/{type}/{id}/similar?api_key=" + EXPO_API_URL + "&language=en-US&region=US&page="
const recommendations = "https://api.themoviedb.org/3/{type}/{id}/recommendations?api_key=" + EXPO_API_URL + "&language=en-US&region=US&page="

// get popular 
const getPopular = ["https://api.themoviedb.org/3/{type}/popular?api_key=" + EXPO_API_URL + "&language=en-US&region=US&page="]

//get Upcoming 
const getUpComing = ["https://api.themoviedb.org/3/{type}/{whenComing}?api_key=" + EXPO_API_URL + "&language=en-US&region=US&page="]

//get Top Rated
const getTopRated = ["https://api.themoviedb.org/3/{type}/top_rated?api_key=" + EXPO_API_URL + "&language=en-US&region=US&page="]

// get Now Playing
const getNowPlaying = ["https://api.themoviedb.org/3/{type}/{whenPlaying}?api_key=" + EXPO_API_URL + "&language=en-US&region=US&page="]

// movies based on a movie
const MatchingMovies = "https://api.themoviedb.org/3/{type}/{id}/recommendations?api_key=" + EXPO_API_URL + "&language=en-US&region=US&page="

// user input for specific movie
const SearchMovie = ["https://api.themoviedb.org/3/search/{type}?api_key=" + EXPO_API_URL + "&language=en-US&query=", "&include_adult=false&page="]

const GenreMovie = ["https://api.themoviedb.org/3/discover/{type}?api_key=" + EXPO_API_URL + "&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=", "&with_watch_monetization_types=flatrate&page="]



// get all images actor tagged in
const ActorImgs = ["https://api.themoviedb.org/3/person/", "/tagged_images?api_key=" + EXPO_API_URL + "&language=en-US&page="]
// get all movies a actor played in
const ActorList = ["https://api.themoviedb.org/3/discover/movie?api_key=" + EXPO_API_URL + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_people=", "&with_watch_monetization_types=flatrate&page="]



// get all episodes for tv
const tvEpisodes = "https://api.themoviedb.org/3/tv/{id}/season/{season_number}?api_key=" + EXPO_API_URL + "&language=en-US&append_to_response=videos,images"
const tvEpisodeInfo = "https://api.themoviedb.org/3/tv/{id}/season/{season_number}/episode/{episode_number}?api_key=" + EXPO_API_URL + "&language=en-US&append_to_response=videos,images,credits"


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
export const genreMovieDict = { 28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Science Fiction", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western" }
export const genreTVDict = { 10759: "Action & Adventure", 16: "Animation", 35: "Comedy", 80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family", 10762: "Kids", 9648: "Mystery", 10763: "News", 10764: "Reality", 10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics", 37: "Western" }




export const getMasterDetails = async (type, id) => {
    let url = masterInfoUrl
    url = url.replace("{type}", type)
    url = url.replace("{id}", id)
    const data = await fetch(url)
    console.log(url)
    return data.json()
}

export const getSeasonDetails = async (id, season) => {
    var url = tvEpisodes
    url = url.replace("{id}", id)
    url = url.replace("{season_number}", season)
    const data = await fetch(url)
    console.log(url)
    return data.json()
}


export const getEpisodeDetails = async (id, season, episode) => {
    var url = tvEpisodeInfo
    url = url.replace("{id}", id)
    url = url.replace("{season_number}", season)
    url = url.replace("{episode_number}", episode)
    const data = await fetch(url)
    console.log(url)
    return data.json()
}

export const getActorDetails = async (id) => {
    var url = getActorInfo
    url = url.replace("{person_id}", id)
    const data = await fetch(url)
    console.log(url)
    return data.json()
}

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

export const reFormatData = (object) => {
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
        if (newText.slice(newText.length - 1) === " ")
            newText = newText.slice(0, newText.length - 2) + "..."
        else
            newText += "..."
    }

    return { "text": newText, "shortened": shortened }
}

export const getShowType = (title) => {
    return title ? "movie" : "tv"
}

export const makeURL = (props, page) => {
    let url = ""

    switch (props.id) {
        case 'nowPlaying':
            url = getNowPlaying + "1"
            url = url.replace("{whenPlaying}", props.showType === "movie" ? "now_playing" : "airing_today")
            break
        case 'upComing':
            url = getUpComing + "1"
            if (props.showType === "movie") {
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
            url = SearchMovie[0] + props.searchQuery + SearchMovie[1] + page
            break
        case 'similar':
            url = similar.replace("{id}", props.video_id)
            url = url + page
            break
        case 'recommendations':
            url = recommendations.replace("{id}", props.video_id)
            url = url + page
            break
        case 'actorMovieList':
            url = ActorList[0] + props.actorID + ActorList[1] + page
            break
        case "actors":
            url = getCast.replace("{id}", props.cast_id)
            break
        case "video":
            url = getVideos.replace("{id}", props.video_id)
            break
        case "master":
            url = masterInfoUrl.replace("{id}", props.master_id)
            break
        case "episodes":
            url = tvEpisodes.replace("{id}", props.master_id)
            url = url.replace("{season_number}", props.seasons_number)
            break
        case "trending":
            url = trending
            break
        default: // props.id = id of movie
            url = MatchingMovies.replace("{id}", props.recommend_id)
            url += page
    }
    console.log(url.replace("{type}", props.showType))
    return url.replace("{type}", props.showType)
}

export const getStreamProviders = async (id, type) => {
    console.log(whereToWatch[0].replace("{type}", type) + id + whereToWatch[1])
    const data = await fetch(whereToWatch[0].replace("{type}", type) + id + whereToWatch[1]);
    const json = await data.json();
    const fullArray = { data: [] };
    const region = await get_region_form_local()
    if (json.results && json.results[region]) {
        const pro = json.results[region];
        const nameAlreadyIn = [];

        if (pro.buy) {
            for (let i = 0; i < pro.buy.length; i++) {
                let provider = pro.buy[i];
                nameAlreadyIn.push(provider.provider_name);
                fullArray["data"].push(provider);
            }
        }

        if (pro.rent) {
            for (let i = 0; i < pro.rent.length; i++) {
                let provider = pro.rent[i];
                if (!nameAlreadyIn.includes(provider.provider_name)) {
                    nameAlreadyIn.push(provider.provider_name);
                    fullArray["data"].push(provider);
                }
            }
        }
        if (pro.flatrate) {
            for (let i = 0; i < pro.flatrate.length; i++) {
                let provider = pro.flatrate[i];
                if (!nameAlreadyIn.includes(provider.provider_name)) {
                    fullArray["data"].push(provider);
                }
            }
        }
    }
    return fullArray
};






















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