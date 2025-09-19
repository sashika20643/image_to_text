import { useState, useCallback } from 'react';
import { ImgBBUploadResponse } from '../types/imgbbTypes';
import { UploadProgress } from '../types/imgbbTypes';
import { ImgBBApiService } from '../services/imgbbApi';

export const useImageUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    setIsUploading(true);
    setUploadProgress([]);
    setUploadedUrls([]);

    // Initialize progress tracking
    const initialProgress: UploadProgress[] = files.map((file: File) => ({
      file,
      progress: 0,
      status: 'pending'
    }));
    setUploadProgress(initialProgress);

    try {
      const responses: ImgBBUploadResponse[] = await ImgBBApiService.uploadMultipleImages(
        files,
        (fileIndex: number, progress: number) => {
          setUploadProgress(prev => prev.map((item, index) => 
            index === fileIndex 
              ? { ...item, progress, status: 'uploading' as const }
              : item
          ));
        }
      );

      // Update progress to completed
      const completedProgress: UploadProgress[] = responses.map((response: ImgBBUploadResponse, index: number) => ({
        file: files[index],
        progress: 100,
        status: 'completed',
        url: response.data.url
      }));
      setUploadProgress(completedProgress);

      // Extract URLs
      const urls: string[] = responses.map((response: ImgBBUploadResponse) => response.data.url);
      setUploadedUrls(urls);

      return urls;
    } catch (error) {
      // Update progress to error
      setUploadProgress(prev => prev.map(item => ({
        ...item,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      })));

      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const resetUpload = useCallback((): void => {
    setUploadProgress([]);
    setUploadedUrls([]);
    setIsUploading(false);
  }, []);

  return {
    uploadImages,
    uploadProgress,
    isUploading,
    uploadedUrls,
    resetUpload
  };
};
