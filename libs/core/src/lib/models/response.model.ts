export interface ResponseModel {
  codeNumber: number;
  trace: {
    sid: string;
    cid: string;
  };
  code: string;
  message: string;
}

export interface PaginationModel {
  first_page: boolean;
  last_page: boolean;
  number_of_elements: number;
  page_number: number;
  page_size: number;
  total_elements: number;
  total_pages: number;
}
