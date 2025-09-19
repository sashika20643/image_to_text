import { ImgBBUploadResponse, ImgBBUploadError } from '../types/imgbbTypes';

const IMGBB_API_KEY: string = import.meta.env.VITE_IMGBB_API_KEY || 'ea6f97236e17aead3ade5fe286837cfb';
const IMGBB_UPLOAD_URL: string = import.meta.env.VITE_IMGBB_UPLOAD_URL || 'https://api.imgbb.com/1/upload';

export class ImgBBApiService {
  public static async uploadImage(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ImgBBUploadResponse> {
    const formData: FormData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    return new Promise((resolve, reject) => {
      const xhr: XMLHttpRequest = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress: number = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response: ImgBBUploadResponse = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response);
            } else {
              const error: ImgBBUploadError = JSON.parse(xhr.responseText);
              reject(new Error(error.error.message));
            }
          } catch (parseError) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });

      xhr.open('POST', IMGBB_UPLOAD_URL);
      xhr.timeout = 30000; // 30 seconds timeout
      xhr.send(formData);
    });
  }

  public static async uploadMultipleImages(
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<ImgBBUploadResponse[]> {
    const uploadPromises: Promise<ImgBBUploadResponse>[] = files.map((file: File, index: number) =>
      this.uploadImage(file, (progress: number) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      })
    );

    return Promise.all(uploadPromises);
  }
}
