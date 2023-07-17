import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class JwtService {
  getToken(): string {
    return window.localStorage['accessToken'];
  }

  saveToken(token: string): void {
    window.localStorage['accessToken'] = token;
  }

  destroyToken(): void {
    window.localStorage.removeItem('accessToken');
  }
}
