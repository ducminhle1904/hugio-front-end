import { Product } from './product.model';
import { ResponseModel } from './response.model';

export interface OrderDetail {
  id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  product: Product;
  quantity: number;
}

export interface OrderResponse extends ResponseModel {
  response: {
    page_number: number;
    page_size: number;
    total_pages: number;
    number_of_elements: number;
    total_elements: number;
    first_page: boolean;
    last_page: boolean;
    content: {
      id: number;
      active: boolean;
      created_at: string;
      updated_at: string;
      created_by: string;
      updated_by: string;
      order_code: string;
      customer_name: string;
      customer_phone_number: string;
      total_price: number;
      order_status: string;
      order_detail: OrderDetail[];
    }[];
  };
}

export interface OrderCreateRequest {
  request: {
    customer_name: string | null;
    customer_phone_number: string | null;
    order_information: {
      product_uid: string;
      quantity: number;
    }[];
  };
}

export interface OrderStatisticRequest {
  request: {
    year: number;
    month: number;
  };
}

export interface OrderStatisticResponse extends ResponseModel {
  response: {
    total_order_in_month: number;
    total_sale_in_month: number;
    total_cancel_order: number;
    sale_each_day: {
      date: string;
      total: number;
    }[];
  };
}
