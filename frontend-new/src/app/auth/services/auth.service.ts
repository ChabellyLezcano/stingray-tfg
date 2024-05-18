import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthResponse, User } from '../interface/authInterface';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Base URL for API requests
  private baseUrl: string = environment.baseUrl;

  // User object stored in the service
  private _user!: User;

  // Getter for the user object
  get user() {
    return { ...this._user };
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  // Method to handle login
  login(
    emailOrUsername: string,
    password: string,
  ): Observable<boolean | string> {
    const url = `${this.baseUrl}/auth`;
    const body = { emailOrUsername, password };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((resp) => {
        if (resp.ok && resp.token) {
          localStorage.setItem('token', resp.token);
          this._user = {
            email: resp.email!,
            username: resp.username!,
            _id: resp._id!,
            role: resp.role!,
            photo: resp.photo!,
            sex: resp.sex!,
          };
        }
      }),
      map((resp) => {
        if (resp.ok) {
          return true;
        } else {
          return (
            resp.msg || 'Error en el servidor. Contacte con el administrador'
          );
        }
      }),
      catchError(this.handleError),
    );
  }

  // Method to handle user registration
  register(
    email: string,
    username: string,
    password: string,
    birthDate: Date,
    sex: string,
  ): Observable<boolean | string> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { email, username, password, birthDate, sex };

    return this.http.post<any>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token);
          this._user = resp.user;
        }
      }),
      map((resp) => {
        if (resp.ok) {
          return true;
        } else {
          return (
            resp.msg || 'Error en el servidor. Contacte con el administrador'
          );
        }
      }),
      catchError(this.handleError),
    );
  }

  // Method to validate a user's token
  validateToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set(
      'token',
      localStorage.getItem('token') || '',
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((resp) => {
        localStorage.setItem('token', resp.token!);
        this._user = {
          ...this._user,
          email: resp.email!,
          username: resp.username!,
          _id: resp._id!,
          role: resp.role!,
          photo: resp.photo!,
        };
        return resp.ok;
      }),
      catchError((err) => of(false)),
    );
  }

  // Method to handle forgot password
  forgotPassword(email: string): Observable<string | boolean | User> {
    const url = `${this.baseUrl}/auth/forgot-password`;
    const body = { email };

    return this.http.post<any>(url, body).pipe(
      map((resp) => {
        if (resp.ok) {
          return true;
        } else {
          return (
            resp.msg ||
            'Error en el servidor. Por favor, contacte con el administrador.'
          );
        }
      }),
      catchError(this.handleError),
    );
  }

  // Method to handle reset password
  resetPassword(token: string, newPassword: string): Observable<any> {
    const url = `${this.baseUrl}/auth/reset-password/${token}`;
    const body = { newPassword };

    return this.http.post<any>(url, body).pipe(
      map((response) => {
        if (response.ok) {
          return { ok: true, msg: response.msg };
        } else {
          return {
            ok: false,
            message: response.msg || 'Error al actualizar la contraseña',
          };
        }
      }),
      map((resp) => {
        if (resp.ok) {
          return true;
        } else {
          return (
            resp.msg ||
            'Error en el servidor. Por favor, contacte con el administrador.'
          );
        }
      }),
      catchError(this.handleError),
    );
  }

  // Method to handle confirm account
  confirmAccount(token: string): Observable<any> {
    const url = `${this.baseUrl}/auth/confirm-account/${token}`;

    return this.http.get<any>(url).pipe(catchError(this.handleError));
  }

  // Method to handle errors
  private handleError(error: HttpErrorResponse): Observable<boolean | string> {
    if (error.error instanceof ErrorEvent) {
      return throwError(
        () =>
          new Error(
            'Se produjo un error en la red, por favor intenta de nuevo.',
          ),
      );
    } else {
      const serverError = error.error.msg || 'Error desconocido del servidor.';

      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        text: serverError,
      });

      return of(serverError);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
