export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errorCode?: string;
  details?: any;
}
