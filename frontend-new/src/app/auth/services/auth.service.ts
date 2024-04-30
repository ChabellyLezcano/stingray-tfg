import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthResponse, User } from '../interface/authInterface';
import { environment } from 'src/environments/environment';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;

  private _user!: User;

  get user() {
    return { ...this._user };
  }

  constructor(private http: HttpClient, private router: Router) {
  }

  login(emailOrUsername: string, password: string): Observable<boolean | string> {
    const url = `${this.baseUrl}/auth`;
    const body = { emailOrUsername, password };

    console.log(body)

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
                  sex: resp.sex!
              };
          }
      }),
      map(resp => resp.ok),
      catchError(this.handleError)
  );
}

  register(email: string, username: string, password: string, birthDate: Date, sex: string): Observable<boolean | string> {
    const url = `${this.baseUrl}/auth/register`;
    const body = { email, username, password, birthDate, sex };

    return this.http.post<any>(url, body).pipe(
      tap((resp) => {
        if (resp.ok) {
          localStorage.setItem('token', resp.token);
          this._user = resp.user;
          console.log(response)
        }
      }),
      map(resp => resp.ok),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Cliente o error de red
      return throwError(() => new Error('Se produjo un error en la red, por favor intenta de nuevo.'));
    } else {
      // El servidor devolvió una respuesta no exitosa
      const serverError = error.error.msg || 'Error desconocido del servidor.';
      return throwError(() => new Error(`Error del servidor: ${serverError}`));
    }
  }

}
