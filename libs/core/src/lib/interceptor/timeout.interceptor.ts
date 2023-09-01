import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private timeoutDuration = 20000; // 15 seconds in milliseconds

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modifiedRequest = request.clone();

    return next.handle(modifiedRequest).pipe(
      timeout(this.timeoutDuration),
      catchError((error) => {
        if (error.name === 'TimeoutError') {
          console.log('Request timed out');
        }

        return throwError(error);
      })
    );
  }
}
