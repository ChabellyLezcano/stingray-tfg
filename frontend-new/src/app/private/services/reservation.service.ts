import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReservationResponse } from '../interfaces/interfaces.interface';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private baseUrl: string = environment.baseUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('token', localStorage.getItem('token') ?? '');
  }

  constructor(private http: HttpClient) {}

  // Create a new reservation
  createReservation(gameId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/${gameId}`;
    const headers = this.getHeaders();

    return this.http.post<ReservationResponse>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error in createReservation:', error);
        return throwError(() => new Error('Error creating reservation'));
      }),
    );
  }

  // Verify if user has a reservation for a game
  hasUserReservationForGame(gameId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/has-reservation/${gameId}`;
    const headers = this.getHeaders();

    return this.http.get<ReservationResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in hasUserReservationForGame:', error);
        return throwError(() => new Error('Error checking reservation status'));
      }),
    );
  }

  // Get admin reservation history
  getAdminReservationHistory(
    page: number,
    limit: number,
    status?: string,
  ): Observable<ReservationResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (status && status !== 'all') {
      params = params.set('status', status);
    }

    const url = `${this.baseUrl}/reservation/admin/history`;
    const headers = this.getHeaders();

    return this.http.get<ReservationResponse>(url, { headers, params }).pipe(
      catchError((error) => {
        console.error('Error in getAdminReservationHistory:', error);
        return throwError(
          () => new Error('Error fetching admin reservation history'),
        );
      }),
    );
  }

  // Get user reservation history
  getUserReservationHistory(): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/user/history`;
    const headers = this.getHeaders();

    return this.http.get<ReservationResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getUserReservationHistory:', error);
        return throwError(
          () => new Error('Error fetching user reservation history'),
        );
      }),
    );
  }

  // Accept a reservation
  acceptReservation(reservationId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/${reservationId}/accept`;
    const headers = this.getHeaders();

    return this.http.patch<ReservationResponse>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error in acceptReservation:', error);
        return throwError(() => new Error('Error accepting reservation'));
      }),
    );
  }

  // Reject a reservation
  rejectReservation(
    reservationId: string,
    rejectionMessage: string,
  ): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/${reservationId}/reject`;
    const headers = this.getHeaders();
    const body = { rejectionMessage };

    return this.http.patch<ReservationResponse>(url, body, { headers }).pipe(
      catchError((error) => {
        console.error('Error in rejectReservation:', error);
        return throwError(() => new Error('Error rejecting reservation'));
      }),
    );
  }

  // Mark a reservation as picked up
  markAsPickedUp(reservationId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/${reservationId}/pickup`;
    const headers = this.getHeaders();

    return this.http.patch<ReservationResponse>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error in markAsPickedUp:', error);
        return throwError(
          () => new Error('Error marking reservation as picked up'),
        );
      }),
    );
  }

  // Mark the reservation as completed
  markAsCompleted(reservationId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/${reservationId}/completed`;
    const headers = this.getHeaders();

    return this.http.patch<ReservationResponse>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error in markAsCompleted:', error);
        return throwError(
          () => new Error('Error marking reservation as completed'),
        );
      }),
    );
  }

  // Cancel a reservation
  cancelReservation(reservationId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/${reservationId}/cancel`;
    const headers = this.getHeaders();

    return this.http.patch<ReservationResponse>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error in cancelReservation:', error);
        return throwError(() => new Error('Error canceling reservation'));
      }),
    );
  }

  // Delete a reservation
  deleteReservation(reservationId: string): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/${reservationId}`;
    const headers = this.getHeaders();

    return this.http.delete<ReservationResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in deleteReservation:', error);
        return throwError(() => new Error('Error deleting reservation'));
      }),
    );
  }
}
