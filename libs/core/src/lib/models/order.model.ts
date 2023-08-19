import { Product } from './product.model';
import { ResponseModel } from './response.model';

export interface OrderDetailDTO {
  id: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  product: Product;
  quantity: number;
}

export interface OrderResponseDTO extends ResponseModel {
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
      total_price: number;
      order_detail: OrderDetailDTO[];
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
