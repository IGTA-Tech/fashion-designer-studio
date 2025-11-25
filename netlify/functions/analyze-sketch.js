import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { images, conversationHistory, userMessage, analysisType } = JSON.parse(event.body);

    // System prompt for fashion design expertise
    const systemPrompt = analysisType === 'sketch'
      ? `You are an expert fashion design consultant with deep knowledge of garment construction,
fabric selection, and wearable clothing design. You're helping a beginner-intermediate level
fashion designer who creates original wearable clothes from her own sketches.

Your role:
- Analyze sketches and understand design intent
- Ask clarifying questions about fabric, color, occasion, and details
- Provide constructive, encouraging feedback
- Suggest construction methods appropriate for her skill level
- Think about practical wearability and construction challenges
- Be warm, supportive, and specific in your guidance

Communication style:
- Warm and conversational (like a supportive friend who knows fashion)
- Use specific fashion/sewing terminology when helpful
- Ask thoughtful clarifying questions
- Offer options rather than single prescriptive advice
- Celebrate good design choices
- Be practical about construction challenges`
      : `You are an expert fashion construction advisor helping a beginner-intermediate sewist
build garments. Analyze work-in-progress photos and provide:

- Current construction stage assessment
- What's going well
- What to watch out for
- Next steps
- Troubleshooting advice if something seems off
- Encouragement!

Be specific, practical, and supportive. Reference what you actually see in the photos.`;

    // Build messages array
    const messages = [];

    // Add conversation history if exists
    if (conversationHistory && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Build the current message content
    const messageContent = [];

    // Add images
    if (images && images.length > 0) {
      images.forEach(img => {
        messageContent.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: img.type || 'image/jpeg',
            data: img.data,
          },
        });
      });
    }

    // Add text
    const textContent = userMessage || (analysisType === 'sketch'
      ? "I've sketched out a design idea. What do you think? Please analyze the design and ask me clarifying questions so we can bring this to life!"
      : "How does this look? Am I on the right track?");

    messageContent.push({
      type: 'text',
      text: textContent,
    });

    messages.push({
      role: 'user',
      content: messageContent,
    });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      temperature: 0.7,
      system: systemPrompt,
      messages: messages,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        analysis: response.content[0].text,
        messageId: response.id,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error analyzing sketch:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to analyze sketch',
        details: error.message
      }),
    };
  }
};
