import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import { generateAiResponse } from '../services/aiService.js';
import { memoryStore } from '../services/memoryStore.js';

export const handleChat = async (req, res, next) => {
  try {
    const { message, language = 'en', conversationId, history } = req.body;
    const userId = req.user._id;
    const isMongo = mongoose.connection.readyState === 1;

    let conversation = null;

    if (conversationId) {
      if (isMongo) {
        conversation = await Conversation.findById(conversationId);
      } else {
        conversation = await memoryStore.findConversationById(conversationId);
      }

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found.',
        });
      }

      // Check ownership
      if (conversation.userId.toString() !== userId.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to this conversation.',
        });
      }
    } else {
      // Create new conversation with title derived from user question
      const cleanTitle =
        message.length > 50 ? `${message.substring(0, 47)}...` : message;

      if (isMongo) {
        conversation = new Conversation({
          userId,
          title: cleanTitle,
          messages: [],
        });
      } else {
        conversation = await memoryStore.createConversation({
          userId,
          title: cleanTitle,
        });
      }
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      text: message,
      language,
      timestamp: new Date(),
    });

    // Generate AI response
    const contextHistory =
      conversation.messages.length > 1
        ? conversation.messages.slice(0, -1)
        : history || [];

    const reply = await generateAiResponse({
      message,
      language,
      history: contextHistory,
    });

    // Add assistant reply to conversation
    conversation.messages.push({
      role: 'assistant',
      text: reply,
      language,
      timestamp: new Date(),
    });

    await conversation.save();

    res.status(200).json({
      success: true,
      reply,
      conversationId: conversation._id,
      title: conversation.title,
    });
  } catch (err) {
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Error generating AI response.',
    });
  }
};
