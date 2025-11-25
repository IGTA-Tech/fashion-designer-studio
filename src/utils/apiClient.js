// API client for Netlify Functions

export const analyzeSketch = async (images, conversationHistory = [], userMessage = '', analysisType = 'sketch') => {
  try {
    const response = await fetch('/.netlify/functions/analyze-sketch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images,
        conversationHistory,
        userMessage,
        analysisType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze sketch');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in analyzeSketch:', error);
    throw error;
  }
};

export const generateDesign = async (prompt, options = {}) => {
  try {
    const response = await fetch('/.netlify/functions/generate-design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style || 'natural',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate design');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in generateDesign:', error);
    throw error;
  }
};

export const getConstructionGuide = async (designDescription, images = [], skillLevel = 'beginner-intermediate') => {
  try {
    const response = await fetch('/.netlify/functions/construction-guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        designDescription,
        images,
        skillLevel,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get construction guide');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getConstructionGuide:', error);
    throw error;
  }
};
