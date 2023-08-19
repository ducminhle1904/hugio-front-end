import { ResponseModel } from './response.model';

export interface User {
  id: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  user_uid: string;
  cif: string;
  email: string;
  phone_number: string;
  address: string;
  full_name: string;
  username: string;
  roles: string[];
}

export interface RoleResponse extends ResponseModel {
  response: string[];
}
export interface InfoResponse extends ResponseModel {
  response: User;
}

export interface LoginResponse extends ResponseModel {
  response: {
    access_token: string;
    info: User;
  };
}

export interface UserDetailResponse extends ResponseModel {
  response: User;
}

export interface UserListResponse extends ResponseModel {
  response: {
    page_number: number;
    page_size: number;
    total_pages: number;
    number_of_elements: number;
    total_elements: number;
    first_page: boolean;
    last_page: boolean;
    content: User[];
  };
}

export interface UserCreateEditRequest {
  request: {
    username: string;
    password: string;
    email: string;
    address: string;
    full_name: string;
    phone_number: string;
    roles: string[];
  };
}
