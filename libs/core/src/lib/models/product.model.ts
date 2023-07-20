import { ResponseModel } from './response.model';

export interface Product {
  active: boolean;
  categories: Category[];
  createdAt: string;
  createdBy: string;
  id: number;
  price: number;
  product_description: string;
  product_details: ProductDetail[];
  product_quantity: number;
  product_name: string;
  product_uid: string;
  raw_product_name: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Category {
  active: boolean;
  category_name: string;
  category_uid: string;
  createdAt: string;
  createdBy: string;
  id: number;
  updatedAt: string;
  updatedBy: string;
}

export interface ProductDetail {
  active: boolean;
  createdAt: string;
  createdBy: string;
  id: number;
  key: string;
  updatedAt: string;
  updatedBy: string;
  value: string;
}

export interface ProductCreateRequest {
  name: string;
  price: number;
  discount: number;
  product_description: string;
  product_quantity: number;
  category: string[];
  details?: [
    {
      key: string;
      value: string;
    }
  ];
}

export interface ProductUpdateRequest {
  product_uid: string;
  name: string;
  price: number;
  discount: number;
  product_description: string;
  category: string[];
  details?: [
    {
      key: string;
      value: string;
    }
  ];
}

export interface ProductResponse extends ResponseModel {
  response: {
    content: Product[];
    first_page: boolean;
    last_page: boolean;
    number_of_elements: number;
    page_number: number;
    page_size: number;
    total_elements: number;
    total_pages: number;
  };
}

export interface CategoryResponse extends ResponseModel {
  response: {
    content: Category[];
    first_page: boolean;
    last_page: boolean;
    number_of_elements: number;
    page_number: number;
    page_size: number;
    total_elements: number;
    total_pages: number;
  };
}
