import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // Load boardgames
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

  // Get game details by id
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

  // Delete a game
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

  // Create a boardgame
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

  // Update boardgame
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
