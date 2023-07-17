import { ResponseModel } from './response.model';

export interface User {
  active: boolean;
  createdAt: string;
  createdBy: string;
  id: number;
  roles: string[];
  updatedAt: string;
  updatedBy: string;
  userUid: string;
  username: string;
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
