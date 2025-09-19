export interface FormData {
  readonly images: File[];
  readonly hints: {
    readonly description_keywords: string;
    readonly designer: string;
    readonly manufacturer: string;
    readonly name_keywords: string;
  };
  readonly systemPrompt: string;
  readonly def_prompt_lang: 'German' | 'English';
  readonly model_name: 'gpt-4.1' | 'gemini-2.5-pro';
}

export interface FormResponse {
  readonly success: boolean;
  readonly message: string;
  readonly data?: unknown;
}

export interface ImagePreviewProps {
  readonly images: File[];
  readonly onRemove: (index: number) => void;
}

export interface ResponseDisplayProps {
  readonly response: FormResponse | null;
  readonly isLoading: boolean;
}
