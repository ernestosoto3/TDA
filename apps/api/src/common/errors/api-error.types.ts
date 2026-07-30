export interface ApiErrorDetail {
  field: string;
  issue: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: ApiErrorDetail[];
  requestId: string;
}

export interface ApiErrorResponse {
  error: ApiErrorPayload;
}

export type ApiErrorInput = Omit<ApiErrorPayload, 'requestId'>;
