import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.validateToken().pipe(
      switchMap(() => {
        const user = this.authService.user;
        if (user && user.role === 'User') {
          return of(true);
        } else {
          this.router.navigate(['/dashboard']);
          return of(false);
        }
      }),
      catchError(() => {
        this.router.navigate(['/dashboard']);
        return of(false);
      }),
    );
  }
}
