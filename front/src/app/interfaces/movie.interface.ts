export interface Genre {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  release_year: number;
  poster_url: string;
  trailer_url: string;
  duration_minutes: number;
  imdb_id: string;
  imdb_rating: number;
  language: string;
  country: string;
  genres: Genre[];
  average_rating: number;
  total_reviews: number;
  times_added: number;
  created_at: string;
}

export interface Review {
  id: number;
  username: string;
  movie: number;
  rating: number;
  title: string;
  body: string;
  contains_spoilers: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserMovie {
  id: number;
  movie: number;
  movie_title: string;
  movie_poster: string;
  status: 'want_to_watch' | 'watching' | 'watched' | 'dropped';
  is_favourite: boolean;
  watched_at: string;
  times_watched: number;
  added_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token?: string;
  error?: string;
}
