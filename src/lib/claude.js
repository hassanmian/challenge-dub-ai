// Claude API helper functions
import { Anthropic } from '@anthropic-ai/sdk';

// Initialize Anthropic client (server-side only)
let anthropic;
if (typeof window === 'undefined') {
  anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });
}

/**
 * Get a response from Claude for a conversation
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} [model='claude-3-opus-20240229'] - Claude model to use
 * @param {number} [maxTokens=1000] - Maximum tokens in response
 * @param {number} [temperature=0.7] - Temperature (randomness)
 * @returns {Promise<string>} - Claude's response
 */
export async function getChatResponse(messages, model = 'claude-3-opus-20240229', maxTokens = 1000, temperature = 0.7) {
  if (!anthropic) {
    throw new Error('Anthropic client is not initialized (server-side only)');
  }
  
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      messages,
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error('Failed to get response from Claude');
  }
}

/**
 * Get a travel recommendation based on user preferences
 * @param {string} preference - User's travel preference
 * @param {Array} packages - Array of available travel packages
 * @returns {Promise<string>} - Recommendation from Claude
 */
export async function getTravelRecommendation(preference, packages) {
  if (!anthropic) {
    throw new Error('Anthropic client is not initialized (server-side only)');
  }
  
  // Format packages as a string for the prompt
  const packageListStr = packages.map(pkg => 
    `${pkg.name} to ${pkg.destination} (${pkg.duration} days, amenities: ${pkg.amenities.join(', ')})`
  ).join('; ');
  
  // Create a system prompt for the recommendation
  const systemPrompt = 'You are a space travel recommendation assistant. Provide personalized suggestions based on user preferences. Keep responses concise, enthusiastic, and futuristic in tone.';
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 300,
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `I prefer ${preference}. Given these space trip options: ${packageListStr}, suggest one package and explain why it fits my interests.` }
      ],
    });
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error getting travel recommendation:', error);
    throw new Error('Failed to get travel recommendation');
  }
} 