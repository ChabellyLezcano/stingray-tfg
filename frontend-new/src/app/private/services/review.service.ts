import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  ReviewResponse,
  RatingResponse,
} from '../interfaces/interfaces.interface';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private baseUrl: string = environment.baseUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('token', localStorage.getItem('token') ?? '');
  }

  constructor(private http: HttpClient) {}

  // Obtener todos los reviews
  getReviews(id: string): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/${id}`;
    const headers = this.getHeaders();

    return this.http.get<ReviewResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getreviews:', error);
        return throwError(() => new Error('Error fetching reviews'));
      }),
    );
  }

  // Obtener los detalles de un review por ID
  getReviewById(id: string): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/review-by-id/${id}`;
    const headers = this.getHeaders();

    return this.http.get<ReviewResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getReviewById:', error);
        return throwError(() => new Error('Error fetching review details'));
      }),
    );
  }

  deleteReview(id: string): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/${id}`;
    const headers = this.getHeaders();

    return this.http.delete<ReviewResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in deleteReview:', error);
        return throwError(() => new Error('Error deleting review'));
      }),
    );
  }

  // Crear un nuevo review
  createReview(
    reviewData: FormData,
    gameId: string,
  ): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/${gameId}`;
    const headers = this.getHeaders();

    return this.http.post<ReviewResponse>(url, reviewData, { headers }).pipe(
      catchError((error) => {
        console.error('Error in createReview:', error);
        return throwError(() => new Error('Error creating review'));
      }),
    );
  }

  updateReview(id: string, reviewData: FormData): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/${id}`;
    const headers = this.getHeaders();

    return this.http.put<ReviewResponse>(url, reviewData, { headers }).pipe(
      catchError((error) => {
        console.error('Error in updateReview:', error);
        return throwError(() => new Error('Error updating review'));
      }),
    );
  }

  getAverageRating(gameId: string): Observable<RatingResponse> {
    const url = `${this.baseUrl}/review/average-rating/${gameId}`;
    const headers = this.getHeaders();

    return this.http.get<RatingResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getAverageRating:', error);
        return throwError(() => new Error('Error fetching average rating'));
      }),
    );
  }

  userHasReview(gameId: string): Observable<ReviewResponse> {
    const url = `${this.baseUrl}/review/user-has-review/${gameId}`;
    const headers = this.getHeaders();

    return this.http.get<ReviewResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getAverageRating:', error);
        return throwError(() => new Error('Error fetching average rating'));
      }),
    );
  }
}
