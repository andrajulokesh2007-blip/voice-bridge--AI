import mongoose from 'mongoose';
import Conversation from '../models/Conversation.js';
import { memoryStore } from '../services/memoryStore.js';

export const getConversations = async (req, res, next) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;
    let conversations = [];

    if (isMongo) {
      conversations = await Conversation.find({ userId: req.user._id })
        .sort({ updatedAt: -1 })
        .lean();
    } else {
      conversations = await memoryStore.findConversationsByUserId(req.user._id);
    }

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (err) {
    next(err);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { title, initialMessage } = req.body;
    const isMongo = mongoose.connection.readyState === 1;

    let conversation = null;

    if (isMongo) {
      const messages = [];
      if (initialMessage) {
        messages.push({
          role: 'user',
          text: initialMessage,
          language: req.user.preferredLanguage || 'en',
          timestamp: new Date(),
        });
      }

      conversation = await Conversation.create({
        userId: req.user._id,
        title: title || 'New Conversation',
        messages,
      });
    } else {
      conversation = await memoryStore.createConversation({
        userId: req.user._id,
        title,
        initialMessage,
        language: req.user.preferredLanguage,
      });
    }

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (err) {
    next(err);
  }
};

export const getConversationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    let conversation = null;
    if (isMongo) {
      conversation = await Conversation.findById(id);
    } else {
      conversation = await memoryStore.findConversationById(id);
    }

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Strict resource ownership check
    if (conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this conversation.',
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isMongo = mongoose.connection.readyState === 1;

    let conversation = null;
    if (isMongo) {
      conversation = await Conversation.findById(id);
    } else {
      conversation = await memoryStore.findConversationById(id);
    }

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.',
      });
    }

    // Strict resource ownership check
    if (conversation.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this conversation.',
      });
    }

    if (isMongo) {
      await Conversation.findByIdAndDelete(id);
    } else {
      await memoryStore.deleteConversation(id);
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
