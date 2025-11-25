import React, { useCallback, useState } from 'react';
import { fileToBase64, compressImage, validateImageFile } from '../utils/imageProcessing';

const SketchUploader = ({ onUpload, onAnalyze, maxImages = 4 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, [uploadedImages]);

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    setLoading(true);
    try {
      const imageFiles = files.filter(file => file.type.startsWith('image/'));

      if (uploadedImages.length + imageFiles.length > maxImages) {
        alert(`Maximum ${maxImages} images allowed`);
        setLoading(false);
        return;
      }

      const processedImages = [];

      for (const file of imageFiles) {
        try {
          validateImageFile(file);
          const compressed = await compressImage(file);
          const base64 = await fileToBase64(compressed);

          processedImages.push({
            file: compressed,
            preview: URL.createObjectURL(compressed),
            ...base64,
          });
        } catch (error) {
          alert(`Error processing ${file.name}: ${error.message}`);
        }
      }

      const newImages = [...uploadedImages, ...processedImages];
      setUploadedImages(newImages);

      if (onUpload) {
        onUpload(newImages);
      }

      // Auto-analyze if this is the first upload
      if (uploadedImages.length === 0 && processedImages.length > 0 && onAnalyze) {
        onAnalyze(processedImages);
      }
    } catch (error) {
      alert('Error uploading files: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    if (onUpload) {
      onUpload(newImages);
    }
  };

  const handleAnalyze = () => {
    if (onAnalyze && uploadedImages.length > 0) {
      onAnalyze(uploadedImages);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      {uploadedImages.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-card p-12 text-center transition-all duration-200 ${
            dragActive
              ? 'border-primary bg-secondary'
              : 'border-border bg-white hover:border-primary'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="text-7xl animate-float">✨📸</div>
            <div>
              <p className="text-xl font-bold gradient-text mb-2">
                Drop your sketch here, queen! 👑
              </p>
              <p className="text-sm text-text-secondary font-medium">
                JPG, PNG, or WEBP • Up to 10MB • {maxImages} images max
              </p>
            </div>
            <label className="btn-primary inline-block cursor-pointer">
              <span className="flex items-center space-x-2">
                <span>💖</span>
                <span>Choose Your Files</span>
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-lg font-bold gradient-text">
              Your Sketches ✨ ({uploadedImages.length})
            </h3>
            {onAnalyze && (
              <button
                onClick={handleAnalyze}
                className="btn-primary text-sm"
                disabled={loading}
              >
                {loading ? '✨ Analyzing...' : '💕 Let\'s Gooo!'}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploadedImages.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-48 object-cover rounded-card"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           flex items-center justify-center font-bold hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-text-secondary">Processing images...</p>
        </div>
      )}
    </div>
  );
};

export default SketchUploader;
