import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { generateUUID } from '@ims/shared';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.loadingService.setLoading(true);
    const apiReq = request.clone({
      url: `https://hugio.ngrok.app${request.url}`,
      body: {
        ...(request.body as object),
        trace: {
          cid: generateUUID(),
        },
      },
    });
    return next.handle(apiReq).pipe(
      finalize(() => {
        // After the HTTP request is completed, set loading back to false
        this.loadingService.setLoading(false);
      })
    );
  }
}
