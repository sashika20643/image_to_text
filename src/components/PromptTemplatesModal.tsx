import { useState, useEffect } from 'react';
import { PromptTemplatesResponse } from '../types/apiTypes';
import { PromptTemplatesApiService } from '../services/promptTemplatesApi';

interface PromptTemplatesModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export const PromptTemplatesModal: React.FC<PromptTemplatesModalProps> = ({ isOpen, onClose }) => {
  const [templates, setTemplates] = useState<PromptTemplatesResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !templates) {
      fetchTemplates();
    }
  }, [isOpen, templates]);

  const fetchTemplates = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response: PromptTemplatesResponse = await PromptTemplatesApiService.fetchPromptTemplates();
      setTemplates(response);
    } catch (err) {
      const errorMessage: string = err instanceof Error ? err.message : 'Failed to fetch prompt templates';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (): void => {
    onClose();
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Prompt Templates & Structure</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading prompt templates...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700 font-medium">Error loading templates</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
              <button
                onClick={fetchTemplates}
                className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {templates && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Prompt Templates & Examples
                </h3>
                <p className="text-blue-700">
                  Discover default templates, custom prompt examples, and learn how to create effective prompts for furniture analysis.
                </p>
              </div>

              {/* Custom Prompt Examples */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Custom Prompt Examples
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* English Examples */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                        🇬🇧 English Examples
                      </h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {templates.custom_prompt_examples.english.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400">
                          <p className="text-sm text-gray-700 italic">"{example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* German Examples */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-3 border-b border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                        🇩🇪 German Examples
                      </h4>
                    </div>
                    <div className="p-4 space-y-3">
                      {templates.custom_prompt_examples.german.map((example, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-green-400">
                          <p className="text-sm text-gray-700 italic">"{example}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Default Templates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Default Templates
                </h3>

                {/* English Template */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                      🇬🇧 English Template
                      <span className="ml-2 text-sm font-normal text-gray-500">(Default)</span>
                    </h4>
                  </div>
                  <div className="p-4">
                    <pre className="whitespace-pre-wrap text-xs text-gray-700 bg-gray-50 p-4 rounded-lg border overflow-x-auto max-h-60">
                      {templates.default_templates.english}
                    </pre>
                  </div>
                </div>

                {/* German Template */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                      🇩🇪 German Template
                    </h4>
                  </div>
                  <div className="p-4">
                    <pre className="whitespace-pre-wrap text-xs text-gray-700 bg-gray-50 p-4 rounded-lg border overflow-x-auto max-h-60">
                      {templates.default_templates.german}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Supported Languages */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Supported Languages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">English</h4>
                    <div className="flex flex-wrap gap-1">
                      {templates.supported_languages.english.map((lang, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-purple-700 mb-2">German</h4>
                    <div className="flex flex-wrap gap-1">
                      {templates.supported_languages.german.map((lang, index) => (
                        <span key={index} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Notes */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Usage Notes & Tips
                </h3>
                <div className="space-y-2">
                  {templates.usage_notes.map((note, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-700 text-sm">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
