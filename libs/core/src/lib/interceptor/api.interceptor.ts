import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { generateUUID } from '../utils/utils';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const apiReq = request.clone({
      url: `https://hugio.ngrok.app${request.url}`,
      body: {
        ...(request.body as object),
        trace: {
          cid: generateUUID(),
        },
      },
    });
    return next.handle(apiReq);
  }
}
