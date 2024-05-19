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

export interface RecommendationResponse {
  _id: string;
  userId: string;
  recommendations: Recommendation[];
  __v: number;
}

export interface Recommendation {
  boardGameId: BoardGameID;
  affinityScore: number;
  _id: string;
}

export interface BoardGameID {
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

export interface ReviewResponse {
  ok: boolean;
  msg: string;
  reviews: Review[];
  review: Review;
  hasReview?: boolean;
}

export interface RatingResponse {
  ok: boolean;
  msg: string;
  averageRating: number;
}

export interface Review {
  _id: string;
  boardGameId: BoardGameID;
  userId: UserID;
  title: string;
  description: string;
  rating: number;
  reviewDate: Date;
  __v: number;
}

export interface UserID {
  _id: string;
  username: string;
  photo: string;
}

export interface ReservationResponse {
  ok: boolean;
  msg: string;
  reservations: Reservation[];
  reservation: Reservation;
  hasReservation?: boolean;
}

export interface Reservation {
  _id: string;
  code: string;
  boardGameId: BoardGameInfo;
  userId: UserID;
  reservationDate: Date;
  status: string;
  __v: number;
  expirationDate?: Date;
  pickupDate?: Date;
  returnDate?: Date;
}

export interface BoardGameInfo {
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
