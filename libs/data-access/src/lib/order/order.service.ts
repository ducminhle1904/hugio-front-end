import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  OrderCreateRequest,
  OrderResponse,
  OrderStatisticRequest,
  OrderStatisticResponse,
  ResponseModel,
} from '@ims/core';
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

  public queryListOrder(): Observable<OrderResponse> {
    return this.http.post<OrderResponse>('/order_service/order/all', {
      request: {
        page_number: 1,
        page_size: 100,
        sort: 'ASC',
      },
    });
  }

  public queryOrderStatistic(
    request: OrderStatisticRequest
  ): Observable<OrderStatisticResponse> {
    return this.http.post<OrderStatisticResponse>(
      '/order_service/order/statistic',
      request
    );
  }

  public confirmOrder(order_code: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/order_service/order/confirm', {
      request: order_code,
    });
  }

  public cancelOrder(order_code: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/order_service/order/cancel', {
      request: order_code,
    });
  }
}
