import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../admin/shared/services/auth.service';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      req = req.clone({
        setParams: {
          auth: this.authService.token
        }
      });
    }

    return next.handle(req)
      .pipe(
        // tap(() => console.log('Interceptor Worked')),
        catchError(
          (error: HttpErrorResponse) => {
            console.warn('[Interceptor Error]', error);

            if (error.status === 401) {
              this.authService.logout();
              this.router.navigate(['/admin', 'logout'], {
                queryParams: {
                  authFailed: true
                }
              });
            }

            return throwError(error);
          }
        )
      );
  }
}
