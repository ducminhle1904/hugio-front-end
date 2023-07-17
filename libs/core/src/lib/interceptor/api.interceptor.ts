import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { generateUUID } from '@ims/shared';

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
