import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { JwtService } from './jwt.service';
import { distinctUntilChanged, tap, shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { InfoResponse, LoginResponse, User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new BehaviorSubject<boolean | null>(null);
  public isAuthenticated = this.isAuthenticatedSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(
    private readonly http: HttpClient,
    private readonly jwtService: JwtService,
    private readonly router: Router
  ) {}

  login(credentials: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/auth_service/auth/login', {
        request: credentials,
      })
      .pipe(
        tap(({ response }) => {
          this.isAuthenticatedSubject.next(true);
          this.jwtService.saveToken(response.access_token);
          this.currentUserSubject.next(response.info);
        })
      );
  }

  logout(): void {
    this.purgeAuth();
    void this.router.navigate(['/remotes-auth']);
  }

  getCurrentUser(): Observable<InfoResponse> {
    return this.http
      .post<InfoResponse>('/auth_service/auth/retrieve-info', {})
      .pipe(
        tap({
          next: ({ response }) => {
            this.currentUserSubject.next(response);
            this.isAuthenticatedSubject.next(true);
          },
          error: () => this.purgeAuth(),
        }),
        shareReplay(1)
      );
  }

  purgeAuth(): void {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }
}
