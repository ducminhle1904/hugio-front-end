import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  http = inject(HttpClient);

  public queryListProduct(): Observable<any> {
    return this.http.post('/product_service/product/all', {});
  }
}
