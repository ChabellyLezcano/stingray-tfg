import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FavoriteResponse } from '../interfaces/interfaces.interface';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('token', localStorage.getItem('token') ?? '');
  }

  // Listar juegos favoritos de un usuario
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

  // Comprobar si un juego está en favoritos
  isGameFavorite(gameId: string): Observable<any> {
    const url = `${this.baseUrl}/favorite/check/${gameId}`;
    const headers = this.getHeaders();

    return this.http.get(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in isGameFavorite:', error);
        return throwError(
          () => new Error('Error checking if game is favorite'),
        );
      }),
    );
  }

  // Añadir juego a favoritos
  addGameToFavorites(gameId: string): Observable<any> {
    const url = `${this.baseUrl}/favorite/${gameId}`;
    const headers = this.getHeaders();

    return this.http.post(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error in addGameToFavorites:', error);
        return throwError(() => new Error('Error adding game to favorites'));
      }),
    );
  }

  // Eliminar juego de favoritos
  removeGameFromFavorites(gameId: string): Observable<any> {
    const url = `${this.baseUrl}/favorite/${gameId}`;
    const headers = this.getHeaders();

    return this.http.delete(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in removeGameFromFavorites:', error);
        return throwError(
          () => new Error('Error removing game from favorites'),
        );
      }),
    );
  }
}
