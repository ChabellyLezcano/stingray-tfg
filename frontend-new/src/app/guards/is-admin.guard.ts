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
export class AdminGuard implements CanActivate {
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
        if (user && user.role === 'Admin') {
          return of(true);
        } else {
          this.router.navigate(['/not-authorized']);
          return of(false);
        }
      }),
      catchError(() => {
        this.router.navigate(['/not-authorized']);
        return of(false);
      }),
    );
  }
}
