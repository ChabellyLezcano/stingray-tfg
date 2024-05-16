export interface BoardgameResponse {
  ok: boolean;
  msg: string;
  boardgames: Boardgame[];
  boardgame: Boardgame[];
}

export interface FavoriteResponse {
  ok: boolean;
  msg: string;
  boardgames: Boardgame[];
  boardgame: Boardgame[];
}

export interface Boardgame {
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
