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
    const { designDescription, images, skillLevel = 'beginner-intermediate' } = JSON.parse(event.body);

    const systemPrompt = `You are an expert garment construction advisor specializing in helping
beginner to intermediate sewists build their designs. Create detailed, practical construction guides.

Your guides should include:
1. Skill level assessment
2. Time estimate
3. Complete materials list with quantities and where to buy
4. Budget estimate
5. Pattern suggestions or drafting guidance
6. Step-by-step construction sequence
7. Common challenges to watch for
8. Pro tips for success
9. Video tutorial recommendations

Format your response clearly with sections, checkboxes for steps, and emojis for visual organization.
Be specific about measurements, quantities, and techniques. Assume access to a basic sewing machine
but not industrial equipment.

The designer's skill level is: ${skillLevel}`;

    // Build message content
    const messageContent = [];

    // Add images if provided
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

    // Add design description
    messageContent.push({
      type: 'text',
      text: `Please create a detailed construction guide for this design: ${designDescription}

Include materials needed, estimated costs, step-by-step instructions, and helpful tips for someone
at a ${skillLevel} skill level. Format it beautifully with clear sections and checkboxes.`,
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: messageContent,
      }],
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guide: response.content[0].text,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('Error generating construction guide:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to generate construction guide',
        details: error.message
      }),
    };
  }
};
