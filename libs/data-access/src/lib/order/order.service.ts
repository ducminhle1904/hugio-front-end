import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { OrderCreateRequest, OrderResponseDTO, ResponseModel } from '@ims/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);

  constructor() {}

  public placeAnOrder(request: OrderCreateRequest): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/order_service/order/place', request);
  }

  public queryListOrder(): Observable<OrderResponseDTO> {
    return this.http.post<OrderResponseDTO>('/order_service/order/all', {
      request: {
        page_number: 1,
        page_size: 100,
        sort: 'ASC',
      },
    });
  }
}
