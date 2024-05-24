import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RecommendationResponse } from '../interfaces/interfaces.interface';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private baseUrl: string = environment.baseUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('token', localStorage.getItem('token') ?? '');
  }

  constructor(private http: HttpClient) {}

  // Obtener todos los juegos
  generateRecommendations(): Observable<RecommendationResponse> {
    const url = `${this.baseUrl}/recommendation`;
    const headers = this.getHeaders();

    return this.http.get<RecommendationResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getGames:', error);
        return throwError(() => new Error('Error fetching games'));
      }),
    );
  }
}
