import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ResponseModel } from '@ims/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);

  constructor() {}

  public placeAnOrder(order_information: any[]): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/order_service/order/place', {
      request: {
        order_information,
      },
    });
  }

  public queryListOrder(): Observable<any> {
    return this.http.post('/order_service/order/all', {
      request: {
        page_number: 1,
        page_size: 100,
        sort: 'ASC',
      },
    });
  }
}
