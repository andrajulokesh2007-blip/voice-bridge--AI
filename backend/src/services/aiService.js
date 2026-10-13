import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

let genAI = null;
if (env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
}

const getLanguageInstruction = (lang) => {
  switch (lang) {
    case 'te':
      return 'You must respond purely in TELUGU (తెలుగు) script. Maintain an empathetic, helpful, polite tone appropriate for a student voice assistant.';
    case 'hi':
      return 'You must respond purely in HINDI (हिन्दी) Devanagari script. Maintain an empathetic, helpful, polite tone appropriate for a student voice assistant.';
    case 'en':
    default:
      return 'You must respond in clear, accessible, and structured ENGLISH. Keep sentences natural and easy to follow when read aloud by Text-to-Speech.';
  }
};

/**
 * Generate context-aware multilingual AI response using Google Gemini
 */
export const generateAiResponse = async ({ message, language = 'en', history = [] }) => {
  if (!env.GEMINI_API_KEY || !genAI) {
    const error = new Error(
      'Gemini AI API key is not configured. Please set GEMINI_API_KEY in backend/.env with a valid key from https://aistudio.google.com/app/apikey'
    );
    error.status = 503;
    throw error;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: `You are VoiceBridge AI, a helpful, friendly, and knowledgeable multilingual voice assistant designed to help students, parents, and citizens communicate with educational institutions and public organizations.
Your responses should be:
1. Direct, clear, and informative.
2. Formatted for spoken clarity: avoid heavy tables or markdown ASCII art; use concise bullet points and short paragraphs suitable for Text-To-Speech (TTS).
3. Explicitly in the requested language: ${getLanguageInstruction(language)}
If the user asks follow-up questions, preserve the context of the conversation.`,
    });

    // Format chat history for Gemini SDK
    // In Gemini SDK, roles are 'user' and 'model'
    const formattedHistory = [];
    if (Array.isArray(history)) {
      history.slice(-8).forEach((item) => {
        const text = item.text || item.content;
        if (text && text.trim()) {
          formattedHistory.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: text.trim() }],
          });
        }
      });
    }

    // Start a chat session with history
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Received an empty response from Gemini AI.');
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini AI generation failed:', error.message);
    // Rethrow clear error
    if (error.status === 503) throw error;
    const customError = new Error(`AI generation error: ${error.message}`);
    customError.status = 502;
    throw customError;
  }
};
