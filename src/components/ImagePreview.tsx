import { ImagePreviewProps } from '../types/formTypes';

export const ImagePreview: React.FC<ImagePreviewProps> = ({ images, onRemove }) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Uploaded Images:</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image: File, index: number) => (
          <div key={`${image.name}-${index}`} className="relative group">
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg border border-gray-300"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors"
              aria-label={`Remove image ${index + 1}`}
            >
              ×
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg truncate">
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
