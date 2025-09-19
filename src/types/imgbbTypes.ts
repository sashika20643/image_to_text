export interface ImgBBUploadResponse {
  readonly data: {
    readonly id: string;
    readonly title: string;
    readonly url_viewer: string;
    readonly url: string;
    readonly display_url: string;
    readonly width: string;
    readonly height: string;
    readonly size: string;
    readonly time: string;
    readonly expiration: string;
  };
  readonly success: boolean;
  readonly status: number;
}

export interface ImgBBUploadError {
  readonly error: {
    readonly message: string;
    readonly code: number;
  };
  readonly success: false;
  readonly status: number;
}

export interface UploadProgress {
  readonly file: File;
  readonly progress: number;
  readonly status: 'pending' | 'uploading' | 'completed' | 'error';
  readonly url?: string;
  readonly error?: string;
}
