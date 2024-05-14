export interface GameResponse {
  ok: boolean;
  msg: string;
  boardgames: Game[];
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
