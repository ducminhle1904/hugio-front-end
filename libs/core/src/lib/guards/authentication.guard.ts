import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
    this.userService.isAuthenticated.subscribe((isAuth) => {
      if (isAuth) {
        return true;
      } else {
        return this.router.navigate(['/remotes-auth']);
      }
    });
    return true;
  }
}
