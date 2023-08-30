import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  ResponseModel,
  RoleResponse,
  UserCreateEditRequest,
  UserDetailResponse,
  UserListResponse,
} from '@ims/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  public queryListUser(userType = 'client'): Observable<UserListResponse> {
    return this.http.post<UserListResponse>('/user_service/user/all', {
      request: {
        page_number: 1,
        page_size: 1000,
        sort: 'ASC',
        content: userType,
      },
    });
  }

  public queryListRole(): Observable<string[]> {
    return this.http
      .post<RoleResponse>('/user_service/role/all', {
        request: {
          page_number: 1,
          page_size: 1000,
          sort: 'ASC',
        },
      })
      .pipe(
        map((response) => {
          return response.response;
        })
      );
  }

  public createUser(request: UserCreateEditRequest): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/user_service/user/create', {
      request,
    });
  }

  public editUser(request: UserCreateEditRequest): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/user_service/user/edit', {
      request,
    });
  }

  public deleteUser(user_uid: string): Observable<ResponseModel> {
    return this.http.post<ResponseModel>('/user_service/user/delete', {
      request: {
        user_uid,
      },
    });
  }

  public getUserDetail(user_uid: string): Observable<UserDetailResponse> {
    return this.http.post<UserDetailResponse>('/user_service/user/detail', {
      request: {
        user_uid,
      },
    });
  }

  public activeUser(user_uid: string): Observable<any> {
    return this.http.post<any>('/user_service/user/active', {
      request: {
        user_uid,
      },
    });
  }
}
