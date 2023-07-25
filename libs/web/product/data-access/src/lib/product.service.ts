import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Category,
  CategoryResponse,
  ProductCreateRequest,
  ProductResponse,
  ProductUpdateRequest,
  ResponseModel,
} from '@ims/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);

  public queryListProduct(): Observable<ProductResponse> {
    return this.http.post<ProductResponse>('/product_service/product/all', {
      request: {
        page_number: 1,
        page_size: 100,
        property: 'string',
        sort: 'ASC',
      },
    });
  }

  public queryListCategory(): Observable<Category[]> {
    return this.http
      .post<CategoryResponse>('/product_service/category/all', {
        request: {
          page_number: 1,
          page_size: 100,
          sort: 'ASC',
        },
      })
      .pipe(
        map((response) => {
          return response.response.content;
        })
      );
  }

  public createProduct(
    request: ProductCreateRequest
  ): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/product_service/product/create', {
      request,
    });
  }

  public updateProduct(
    request: ProductUpdateRequest
  ): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/product_service/product/edit', {
      request,
    });
  }

  public deleteProduct(product_id: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/product_service/product/delete', {
      request: {
        product_id,
        is_permanent: true,
      },
    });
  }
}
