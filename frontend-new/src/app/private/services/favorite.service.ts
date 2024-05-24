import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  FavoriteResponse,
  IsFavorite,
} from '../interfaces/interfaces.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('token', localStorage.getItem('token') ?? '');
  }

  // List favorite boardgames
  listFavorites(): Observable<FavoriteResponse> {
    const url = `${this.baseUrl}/favorite`;
    const headers = this.getHeaders();

    return this.http.get<FavoriteResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in listFavorites:', error);
        return throwError(() => new Error('Error fetching favorites'));
      }),
    );
  }

  // Check if a game is favorite
  isGameFavorite(gameId: string): Observable<IsFavorite> {
    const url = `${this.baseUrl}/favorite/check/${gameId}`;
    const headers = this.getHeaders();

    return this.http.get<IsFavorite>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in isGameFavorite:', error);
        return throwError(
          () => new Error('Error checking if game is favorite'),
        );
      }),
    );
  }

  // Add game to favorites
  addGameToFavorites(gameId: string): Observable<FavoriteResponse> {
    const url = `${this.baseUrl}/favorite/${gameId}`;
    const headers = this.getHeaders();

    return this.http.post<FavoriteResponse>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error in addGameToFavorites:', error);
        return throwError(() => new Error('Error adding game to favorites'));
      }),
    );
  }

  // Remove a game from favorites
  removeGameFromFavorites(gameId: string): Observable<FavoriteResponse> {
    const url = `${this.baseUrl}/favorite/${gameId}`;
    const headers = this.getHeaders();

    return this.http.delete<FavoriteResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in removeGameFromFavorites:', error);
        return throwError(
          () => new Error('Error removing game from favorites'),
        );
      }),
    );
  }
}
