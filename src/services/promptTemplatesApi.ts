import { PromptTemplatesResponse, ApiError } from '../types/apiTypes';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export class PromptTemplatesApiService {
  private static readonly ENDPOINTS = {
    PROMPT_TEMPLATES: '/prompt-templates'
  } as const;

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
        code: 'HTTP_ERROR'
      };
      throw error;
    }

    try {
      return await response.json();
    } catch (parseError) {
      const error: ApiError = {
        message: 'Failed to parse response JSON',
        code: 'PARSE_ERROR'
      };
      throw error;
    }
  }

  public static async fetchPromptTemplates(): Promise<PromptTemplatesResponse> {
    try {
      const url: string = `${API_BASE_URL}${this.ENDPOINTS.PROMPT_TEMPLATES}`;
      console.log('Fetching prompt templates from:', url);
      
      const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return await this.handleResponse<PromptTemplatesResponse>(response);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const apiError: ApiError = {
          message: `Unable to connect to API server at ${API_BASE_URL}. Please ensure the server is running.`,
          code: 'CONNECTION_ERROR'
        };
        throw apiError;
      }
      
      if (error instanceof Error) {
        const apiError: ApiError = {
          message: error.message,
          code: 'NETWORK_ERROR'
        };
        throw apiError;
      }
      
      throw error;
    }
  }
}
