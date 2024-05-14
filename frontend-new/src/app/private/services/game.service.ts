import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GameResponse } from '../interfaces/games.interface';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private baseUrl: string = environment.baseUrl; // Ajusta la URL de tu API

  constructor(private http: HttpClient) {}

  // Obtener todos los juegos
  getGames(): Observable<GameResponse> {
    const url = `${this.baseUrl}/game`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') ?? '',
    );

    return this.http.get<GameResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getGames:', error);
        return throwError(() => new Error('Error fetching games'));
      }),
    );
  }
}
