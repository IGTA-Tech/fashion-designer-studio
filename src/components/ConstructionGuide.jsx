import React from 'react';

const ConstructionGuide = ({ guide, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(guide);
    alert('Guide copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-card max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold">Construction Guide</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="btn-secondary text-sm"
            >
              📋 Copy
            </button>
            <button
              onClick={handlePrint}
              className="btn-secondary text-sm"
            >
              🖨️ Print
            </button>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap font-body text-text-primary leading-relaxed">
              {guide}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-surface">
          <p className="text-sm text-text-secondary text-center">
            💡 Save this guide for reference or print it to keep at your sewing station!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConstructionGuide;
