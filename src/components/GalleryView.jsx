import React, { useState } from 'react';

const GalleryView = ({ images, onSave, onRegenerate }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleDownload = (image) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${image.base64}`;
    link.download = `design-${Date.now()}.jpg`;
    link.click();
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <div className="text-6xl mb-4">🎨</div>
        <p className="text-lg">No generated designs yet</p>
        <p className="text-sm mt-2">Use the controls to generate visualizations</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-heading text-xl font-semibold">Generated Designs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="card group cursor-pointer" onClick={() => handleImageClick(image)}>
              <img
                src={image.url || `data:image/jpeg;base64,${image.base64}`}
                alt={`Generated design ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg mb-3"
              />
              <div className="space-y-2">
                {image.revisedPrompt && (
                  <p className="text-xs text-text-secondary line-clamp-2">
                    {image.revisedPrompt}
                  </p>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image);
                    }}
                    className="flex-1 px-3 py-2 bg-secondary hover:bg-primary hover:text-white
                             rounded-button text-sm font-medium transition-colors duration-200"
                  >
                    ⬇️ Download
                  </button>
                  {onSave && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSave(image);
                      }}
                      className="flex-1 px-3 py-2 bg-accent hover:bg-success text-white
                               rounded-button text-sm font-medium transition-colors duration-200"
                    >
                      💾 Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for full-size view */}
      {showModal && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url || `data:image/jpeg;base64,${selectedImage.base64}`}
              alt="Full size preview"
              className="max-w-full max-h-[90vh] object-contain rounded-card"
            />
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={() => handleDownload(selectedImage)}
                className="btn-primary"
              >
                ⬇️ Download
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GalleryView;
