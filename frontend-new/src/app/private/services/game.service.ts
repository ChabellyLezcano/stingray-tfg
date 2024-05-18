import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GameResponse } from '../interfaces/interfaces.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private baseUrl: string = environment.baseUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('token', localStorage.getItem('token') ?? '');
  }

  constructor(private http: HttpClient) {}

  // Obtener todos los juegos
  getGames(): Observable<GameResponse> {
    const url = `${this.baseUrl}/game`;
    const headers = this.getHeaders();

    return this.http.get<GameResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getGames:', error);
        return throwError(() => new Error('Error fetching games'));
      }),
    );
  }

  // Obtener los detalles de un juego por ID
  getGameById(id: string): Observable<GameResponse> {
    const url = `${this.baseUrl}/game/${id}`;
    const headers = this.getHeaders();

    return this.http.get<GameResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getGameById:', error);
        return throwError(() => new Error('Error fetching game details'));
      }),
    );
  }

  deleteGame(id: string): Observable<GameResponse> {
    const url = `${this.baseUrl}/game/${id}`;
    const headers = this.getHeaders();

    return this.http.delete<GameResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in deleteGame:', error);
        return throwError(() => new Error('Error deleting game'));
      }),
    );
  }

  // Crear un nuevo juego
  createGame(gameData: FormData): Observable<GameResponse> {
    const url = `${this.baseUrl}/game`;
    const headers = this.getHeaders();

    return this.http.post<GameResponse>(url, gameData, { headers }).pipe(
      catchError((error) => {
        console.error('Error in createGame:', error);
        return throwError(() => new Error('Error creating game'));
      }),
    );
  }

  updateGame(id: string, gameData: FormData): Observable<GameResponse> {
    const url = `${this.baseUrl}/game/${id}`;
    const headers = this.getHeaders();

    return this.http.put<GameResponse>(url, gameData, { headers }).pipe(
      catchError((error) => {
        console.error('Error in updateGame:', error);
        return throwError(() => new Error('Error updating game'));
      }),
    );
  }
}
