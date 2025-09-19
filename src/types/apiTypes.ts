export interface PromptTemplatesResponse {
  readonly default_templates: {
    readonly german: string;
    readonly english?: string;
    readonly french?: string;
  };
}

export interface ApiError {
  readonly message: string;
  readonly status?: number;
  readonly code?: string;
}

export interface ApiResponse<T> {
  readonly data: T | null;
  readonly error: ApiError | null;
  readonly loading: boolean;
}
