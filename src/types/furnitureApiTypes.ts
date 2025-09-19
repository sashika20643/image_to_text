export interface FurnitureAnalysisRequest {
  readonly image_urls: string[];
  readonly hints: {
    readonly description_keywords: string[];
    readonly designer: string[];
    readonly manufacturer: string[];
    readonly name_keywords: string[];
  };
  readonly prompt: string;
  readonly def_prompt_lang: 'German' | 'English';
  readonly model_name: 'gpt-4.1' | 'gemini-2.5-pro';
}

export interface FurnitureAnalysisResponse {
  readonly _metadata: {
    readonly custom_prompt_used: boolean;
    readonly hints_provided: boolean;
    readonly prompt_language: string;
  };
  readonly condition: string;
  readonly description: string;
  readonly designer: string;
  readonly hints_used: {
    readonly description_keywords: string[];
    readonly designer: string[];
    readonly manufacturer: string[];
    readonly name_keywords: string[];
  };
  readonly manufacturer: string;
  readonly name: string;
  readonly price_range_chf: string;
}

export interface FurnitureAnalysisError {
  readonly error: string;
  readonly message: string;
  readonly status: number;
}
