import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
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

  // Get recommendations
  getRecommendations(): Observable<RecommendationResponse> {
    const url = `${this.baseUrl}/recommendation`;
    const headers = this.getHeaders();

    return this.http
      .get<RecommendationResponse>(url, { headers })
      .pipe(catchError(this.handleError));
  }

  // Generate recommendations
  generateRecommendations(): Observable<RecommendationResponse> {
    const url = `${this.baseUrl}/recommendation/generate`;
    const headers = this.getHeaders();

    return this.http
      .post<RecommendationResponse>(url, {}, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error in service:', error);
    return throwError(() => new Error('Error fetching data from server'));
  }
}
