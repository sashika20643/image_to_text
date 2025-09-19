import { FurnitureAnalysisRequest, FurnitureAnalysisResponse, FurnitureAnalysisError } from '../types/furnitureApiTypes';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export class FurnitureAnalysisApiService {
  private static readonly ENDPOINTS = {
    ANALYZE_FURNITURE: '/analyze-furniture'
  } as const;

  private static async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      try {
        const errorData: FurnitureAnalysisError = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    try {
      return await response.json();
    } catch (parseError) {
      throw new Error('Failed to parse response JSON');
    }
  }

  public static async analyzeFurniture(request: FurnitureAnalysisRequest): Promise<FurnitureAnalysisResponse> {
    try {
      const url: string = `${API_BASE_URL}${this.ENDPOINTS.ANALYZE_FURNITURE}`;
      console.log('Analyzing furniture with request:', request);
      
      const response: Response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });

      return await this.handleResponse<FurnitureAnalysisResponse>(response);
    } catch (error) {
      console.error('Furniture Analysis API Error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Unable to connect to furniture analysis API at ${API_BASE_URL}. Please ensure the server is running.`);
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('An unexpected error occurred during furniture analysis');
    }
  }
}
