import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FirebaseAuthResponse, User } from '../../../shared/interfaces';
import { Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public error$: Subject<string> = new Subject<string>();

  get token(): string | null {
    const expirationDate = new Date( localStorage.getItem('fb-token-exp') );

    if (new Date() > expirationDate) {
      this.logout();
      return null;
    }

    return localStorage.getItem('fb-token') ?? '';
  }

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<any> {
    return this.http.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      {
        ...user,
        returnSecureToken: true
      }
    ).pipe(
      tap(this.setToken),
      catchError((error) => this.handleError(error))
    );
  }

  logout(): void {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse): Observable<HttpErrorResponse> {
    const { message } = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный E-mail');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('E-mail не найден');
        break;
    }

    return throwError(error);
  }

  private setToken(response: FirebaseAuthResponse): void {
    if (response) {
      const expirationDate = new Date(new Date().getTime() + +response.expiresIn * 1000);

      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expirationDate.toString());
    } else {
      // localStorage.clear();
      localStorage.removeItem('fb-token');
      localStorage.removeItem('fb-token-exp');
    }
  }
}
