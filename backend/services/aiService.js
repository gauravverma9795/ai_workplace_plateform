const axios = require('axios');
const ErrorResponse = require('../utils/errorResponse');
const ApiKey = require('../models/ApiKey');

// Function to generate content using OpenAI API
exports.generateContent = async (prompt, maxTokens = 500, userId) => {
  try {
    // Get API key - first try user's own key, then fall back to system key
    let apiKey = await ApiKey.findOne({ 
      user: userId, 
      service: 'openai',
      active: true 
    });

    // If no user API key, use the system default
    const key = apiKey ? apiKey.key : process.env.OPENAI_API_KEY;

    if (!key) {
      throw new ErrorResponse('No valid API key found for OpenAI', 400);
    }

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'text-davinci-003',
        prompt,
        max_tokens: maxTokens,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        }
      }
    );

    // Update last used timestamp if using user's API key
    if (apiKey) {
      await ApiKey.findByIdAndUpdate(apiKey._id, { lastUsed: Date.now() });
    }

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('AI Generation Error:', error.response?.data || error.message);
    
    // Handle different types of errors
    if (error.response?.status === 429) {
      throw new ErrorResponse('API rate limit exceeded. Please try again later.', 429);
    } else if (error.response?.status === 401) {
      throw new ErrorResponse('Invalid API key', 401);
    } else {
      throw new ErrorResponse('Failed to generate content', 500);
    }
  }
};