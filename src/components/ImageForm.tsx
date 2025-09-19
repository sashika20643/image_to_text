import { useState, useRef } from 'react';
import { FormData, FormResponse } from '../types/formTypes';
import { ImagePreview } from './ImagePreview';
import { ResponseDisplay } from './ResponseDisplay';
import { PromptTemplatesModal } from './PromptTemplatesModal';
import { useImageUpload } from '../hooks/useImageUpload';
import { FurnitureAnalysisApiService } from '../services/furnitureAnalysisApi';
import { FurnitureAnalysisResponse } from '../types/furnitureApiTypes';

export const ImageForm: React.FC = () => {
  const { uploadImages, uploadProgress, isUploading, resetUpload } = useImageUpload();
  
  const [formData, setFormData] = useState<FormData>({
    images: [],
    hints: {
      description_keywords: '',
      designer: '',
      manufacturer: '',
      name_keywords: ''
    },
    systemPrompt: '',
    def_prompt_lang: 'German',
    model_name: 'gpt-4.1'
  });
  const [response, setResponse] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files: FileList | null = event.target.files;
    if (files) {
      const newImages: File[] = Array.from(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const handleRemoveImage = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (field: keyof Pick<FormData, 'systemPrompt' | 'def_prompt_lang' | 'model_name'>) => 
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }));
    };

  const handleHintsChange = (field: keyof FormData['hints']) => 
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setFormData(prev => ({
        ...prev,
        hints: {
          ...prev.hints,
          [field]: event.target.value
        }
      }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true);
    setResponse(null);

    try {
      // Upload images to ImgBB first
      const imageUrls: string[] = await uploadImages(formData.images);
      
      // Prepare hints data for API (convert strings to arrays)
      const hintsData = {
        description_keywords: formData.hints.description_keywords ? formData.hints.description_keywords.split(',').map(s => s.trim()) : [],
        designer: formData.hints.designer ? formData.hints.designer.split(',').map(s => s.trim()) : [],
        manufacturer: formData.hints.manufacturer ? formData.hints.manufacturer.split(',').map(s => s.trim()) : [],
        name_keywords: formData.hints.name_keywords ? formData.hints.name_keywords.split(',').map(s => s.trim()) : []
      };
      
      // Call furniture analysis API
      const analysisResponse: FurnitureAnalysisResponse = await FurnitureAnalysisApiService.analyzeFurniture({
        image_urls: imageUrls,
        hints: hintsData,
        prompt: formData.systemPrompt,
        def_prompt_lang: formData.def_prompt_lang,
        model_name: formData.model_name
      });
      
      const successResponse: FormResponse = {
        success: true,
        message: `Successfully analyzed ${imageUrls.length} images`,
        data: analysisResponse
      };
      
      setResponse(successResponse);
    } catch (error) {
      const errorResponse: FormResponse = {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred while processing your request. Please try again.',
        data: error
      };
      setResponse(errorResponse);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      images: [],
      hints: {
        description_keywords: '',
        designer: '',
        manufacturer: '',
        name_keywords: ''
      },
      systemPrompt: '',
      def_prompt_lang: 'German',
      model_name: 'gpt-4.1'
    });
    setResponse(null);
    resetUpload();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Image to Text
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Choose Images
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Select multiple images to upload
                </p>
              </div>
              <ImagePreview images={formData.images} onRemove={handleRemoveImage} />
              
              {/* Upload Progress */}
              {uploadProgress.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Progress:</h3>
                  <div className="space-y-2">
                    {uploadProgress.map((item, index) => (
                      <div key={`${item.file.name}-${index}`} className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {item.file.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.status === 'completed' ? '✓' : 
                             item.status === 'error' ? '✗' : 
                             `${item.progress}%`}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              item.status === 'completed' ? 'bg-green-500' :
                              item.status === 'error' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        {item.error && (
                          <p className="text-sm text-red-500 mt-1">{item.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hints Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Hints</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description Keywords */}
                <div>
                  <label htmlFor="description_keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Description Keywords
                  </label>
                  <input
                    type="text"
                    id="description_keywords"
                    value={formData.hints.description_keywords}
                    onChange={handleHintsChange('description_keywords')}
                    placeholder="e.g., vintage, wooden, mid-century"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Designer */}
                <div>
                  <label htmlFor="designer" className="block text-sm font-medium text-gray-700 mb-2">
                    Designer
                  </label>
                  <input
                    type="text"
                    id="designer"
                    value={formData.hints.designer}
                    onChange={handleHintsChange('designer')}
                    placeholder="e.g., Charles Eames, Arne Jacobsen"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Manufacturer */}
                <div>
                  <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-2">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    id="manufacturer"
                    value={formData.hints.manufacturer}
                    onChange={handleHintsChange('manufacturer')}
                    placeholder="e.g., Herman Miller, Vitra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Name Keywords */}
                <div>
                  <label htmlFor="name_keywords" className="block text-sm font-medium text-gray-700 mb-2">
                    Name Keywords
                  </label>
                  <input
                    type="text"
                    id="name_keywords"
                    value={formData.hints.name_keywords}
                    onChange={handleHintsChange('name_keywords')}
                    placeholder="e.g., chair, table, lamp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* System Prompt Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700">
                  Custom System Prompt (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setIsPromptModalOpen(true)}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Prompts & Templates
                </button>
              </div>
              <textarea
                id="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleInputChange('systemPrompt')}
                placeholder="🎯 We've already set up a smart default prompt in german and english that creates SEO-optimized titles and sales descriptions for furniture analysis. 

💡 Leave this empty to use our optimized default, or write your own custom instructions here to override the default behavior..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            {/* Dropdown Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Default Prompt Language */}
              <div>
                <label htmlFor="def_prompt_lang" className="block text-sm font-medium text-gray-700 mb-2">
                  Default Prompt Language
                </label>
                <select
                  id="def_prompt_lang"
                  value={formData.def_prompt_lang}
                  onChange={handleInputChange('def_prompt_lang')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="German">German</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* Model Name */}
              <div>
                <label htmlFor="model_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Model Name
                </label>
                <select
                  id="model_name"
                  value={formData.model_name}
                  onChange={handleInputChange('model_name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="gpt-4.1">GPT-4.1</option>
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                </select>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={isLoading || isUploading || formData.images.length === 0}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? 'Uploading Images...' : isLoading ? 'Processing...' : 'Submit Form'}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Reset Form
              </button>
            </div>
          </form>

          {/* Response Display */}
          <ResponseDisplay response={response} isLoading={isLoading} />
        </div>
      </div>

      {/* Prompt Templates Modal */}
      <PromptTemplatesModal 
        isOpen={isPromptModalOpen} 
        onClose={() => setIsPromptModalOpen(false)} 
      />
    </div>
  );
};
