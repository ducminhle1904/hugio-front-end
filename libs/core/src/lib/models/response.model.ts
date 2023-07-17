export interface ResponseModel {
  codeNumber: number;
  trace: {
    sid: string;
    cid: string;
  };
  code: string;
  message: string;
}
