import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ReservationResponse } from '../interfaces/interfaces.interface'; // Asegúrate de tener esta interfaz definida

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private baseUrl: string = environment.baseUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set('token', localStorage.getItem('token') ?? '');
  }

  constructor(private http: HttpClient) {}

  // Crear una nueva reserva
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

  // Verificar si un usuario tiene una reserva para un juego específico
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

  // Obtener el historial de reservas del administrador
  getAdminReservationHistory(
    page: number,
    limit: number,
  ): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/admin/history?page=${page}&limit=${limit}`;
    const headers = this.getHeaders();

    return this.http.get<ReservationResponse>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error in getAdminReservationHistory:', error);
        return throwError(
          () => new Error('Error fetching admin reservation history'),
        );
      }),
    );
  }
  // Obtener el historial de reservas del usuario
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

  // Aprobar reserva
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

  // Rechazar reserva
  rejectReservation(
    reservationId: string,
    rejectionMessage: string,
  ): Observable<ReservationResponse> {
    const url = `${this.baseUrl}/reservation/${reservationId}/reject`;
    const headers = this.getHeaders();

    return this.http.patch<ReservationResponse>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error in rejectReservation:', error);
        return throwError(() => new Error('Error rejecting reservation'));
      }),
    );
  }

  // Marcar reserva como recogida
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

  // Marcar reserva como completada
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

  // Cancelar reserva
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

  // Borrar reserva
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
