import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { BoardgameResponse } from '../interfaces/games.interface';

@Injectable({
  providedIn: 'root',
})
export class BoardgameService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener todos los juegos
  getGames(): Observable<BoardgameResponse> {
    const url = `${this.baseUrl}/game`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') ?? '',
    );

    return this.http.get<BoardgameResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getGames:', error);
        return throwError(() => new Error('Error fetching games'));
      }),
    );
  }

  // Obtener los detalles de un juego por ID
  getGameById(id: string): Observable<BoardgameResponse> {
    const url = `${this.baseUrl}/game/${id}`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') ?? '',
    );

    return this.http.get<BoardgameResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getGameById:', error);
        return throwError(() => new Error('Error fetching game details'));
      }),
    );
  }
}
