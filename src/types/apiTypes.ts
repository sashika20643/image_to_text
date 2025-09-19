export interface PromptTemplatesResponse {
  readonly custom_prompt_examples: {
    readonly english: string[];
    readonly german: string[];
  };
  readonly default_templates: {
    readonly english: string;
    readonly german: string;
  };
  readonly supported_languages: {
    readonly english: string[];
    readonly german: string[];
  };
  readonly usage_notes: string[];
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
