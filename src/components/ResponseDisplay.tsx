import { ResponseDisplayProps } from '../types/formTypes';

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-blue-700 font-medium">Processing your request...</span>
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Response:</h3>
      <div className={`p-6 rounded-lg border ${
        response.success 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-3 h-3 rounded-full ${
            response.success ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={`font-medium ${
            response.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {response.success ? 'Success' : 'Error'}
          </span>
        </div>
        <div className={`text-sm ${
          response.success ? 'text-green-800' : 'text-red-800'
        }`}>
          <p className="mb-4">{response.message}</p>
          {response.data ? (
            <div className="mt-4">
              <pre className="p-3 bg-white bg-opacity-50 rounded border text-xs overflow-auto max-h-96">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
