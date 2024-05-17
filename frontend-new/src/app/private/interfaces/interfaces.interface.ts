export interface GameResponse {
  ok: boolean;
  msg: string;
  boardgames: Game[];
  boardgame: Game;
}

export interface FavoriteResponse {
  ok: boolean;
  msg: string;
  favorites: Game[];
}

export interface IsFavorite {
  ok: boolean;
  msg: string;
}

export interface Game {
  _id: string;
  code: string;
  title: string;
  description: string;
  status: string;
  mainPhoto: string;
  photoGallery: string[];
  tags: string[];
  averageRating: number;
  __v: number;
}
