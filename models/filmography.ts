export interface FilmographyCast {
  adult: boolean;
  backdrop_path: null | string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: null | string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  name: string,
  first_air_date: string;
  vote_count: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
}