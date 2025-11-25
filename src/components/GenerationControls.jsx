import React, { useState } from 'react';

const GenerationControls = ({ onGenerate, currentDesignDescription, loading }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [environment, setEnvironment] = useState('studio');
  const [size, setSize] = useState('1024x1024');
  const [style, setStyle] = useState('natural');

  const presets = [
    {
      id: 'colors',
      label: 'Color Pop',
      icon: '🎨',
      description: 'See it in dreamy colors!',
      prompt: (desc) => `Professional fashion photography of ${desc}, shown in a stunning different color palette. Studio lighting, white background, high-quality product photo, gorgeous colors.`,
    },
    {
      id: 'angles',
      label: '360° View',
      icon: '🔄',
      description: 'All the angles, babe',
      prompt: (desc) => `Professional fashion photography showing different angle of ${desc}. Studio lighting, white background, clear construction details visible, beautiful composition.`,
    },
    {
      id: 'dressform',
      label: 'Dress Form',
      icon: '👗',
      description: 'On the mannequin',
      prompt: (desc) => `${desc} displayed on an elegant dress form mannequin. Chic studio setting with warm wood floors, natural lighting, fashion design studio atmosphere, aesthetic and beautiful.`,
    },
    {
      id: 'styled',
      label: 'Editorial',
      icon: '💃',
      description: 'Fashion week ready!',
      prompt: (desc) => `Stunning fashion editorial photo of a model wearing ${desc}. Professional styling, gorgeous lighting, lifestyle setting, magazine quality, absolutely beautiful.`,
    },
  ];

  const handlePresetClick = (preset) => {
    if (loading || !currentDesignDescription) return;

    const prompt = preset.prompt(currentDesignDescription);
    onGenerate({
      prompt,
      size,
      style,
      environment,
    });
  };

  const handleCustomGenerate = () => {
    if (loading || !customPrompt.trim()) return;

    onGenerate({
      prompt: customPrompt,
      size,
      style,
      environment,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-heading text-xl font-bold gradient-text mb-4">✨ Make It Real</h3>

        {!currentDesignDescription && (
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-card p-4 text-sm font-medium text-text-primary border-2 border-border">
            💡 Upload and analyze your sketch first, then watch the magic happen!
          </div>
        )}

        {/* Preset Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              disabled={loading || !currentDesignDescription}
              className="card hover:scale-105 transition-transform duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       text-left"
            >
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{preset.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-text-primary">{preset.label}</div>
                  <div className="text-sm text-text-secondary">{preset.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div>
        <label className="block font-bold gradient-text mb-2 text-sm uppercase tracking-wide">
          ✍️ Custom Vibe
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Describe your vision... be as creative as you want! 💭✨"
          className="input-field h-24 resize-none"
          disabled={loading || !currentDesignDescription}
        />
        <button
          onClick={handleCustomGenerate}
          disabled={loading || !customPrompt.trim() || !currentDesignDescription}
          className="btn-primary mt-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '✨ Creating Magic...' : '🎨 Generate My Vision'}
        </button>
      </div>

      {/* Options */}
      <div className="space-y-4 pt-4 border-t border-border">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Image Size
          </label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="input-field"
            disabled={loading}
          >
            <option value="1024x1024">Square (1024x1024)</option>
            <option value="1024x1792">Portrait (1024x1792)</option>
            <option value="1792x1024">Landscape (1792x1024)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="input-field"
            disabled={loading}
          >
            <option value="natural">Natural (Photo-realistic)</option>
            <option value="vivid">Vivid (Enhanced colors)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GenerationControls;
