export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  vote_average: number;
}

export interface Show {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  original_name: string;
}