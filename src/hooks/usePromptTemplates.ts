import { useState, useEffect } from 'react';
import { PromptTemplatesResponse, ApiError, ApiResponse } from '../types/apiTypes';
import { PromptTemplatesApiService } from '../services/promptTemplatesApi';

export const usePromptTemplates = (): ApiResponse<PromptTemplatesResponse> => {
  const [data, setData] = useState<PromptTemplatesResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTemplates = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response: PromptTemplatesResponse = await PromptTemplatesApiService.fetchPromptTemplates();
        setData(response);
      } catch (err) {
        const apiError: ApiError = err as ApiError;
        setError(apiError);
        console.error('Failed to fetch prompt templates:', apiError);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  return { data, error, loading };
};
