import mongoose from 'mongoose';
import User from '../models/User.js';
import { memoryStore } from '../services/memoryStore.js';

export const getSettings = async (req, res, next) => {
  try {
    const isMongo = mongoose.connection.readyState === 1;
    let user = null;

    if (isMongo) {
      user = await User.findById(req.user._id).select(
        'name email preferredLanguage autoPlaySpeech createdAt'
      );
    } else {
      user = await memoryStore.findUserById(req.user._id);
    }

    const safeUser = typeof user?.toJSON === 'function' ? user.toJSON() : user;

    res.status(200).json({
      success: true,
      settings: safeUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { preferredLanguage, autoPlaySpeech } = req.body;
    const isMongo = mongoose.connection.readyState === 1;

    let updatedUser = null;
    if (isMongo) {
      const updates = {};
      if (preferredLanguage !== undefined) updates.preferredLanguage = preferredLanguage;
      if (autoPlaySpeech !== undefined) updates.autoPlaySpeech = autoPlaySpeech;

      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('name email preferredLanguage autoPlaySpeech updatedAt');
    } else {
      updatedUser = await memoryStore.updateUser(req.user._id, {
        preferredLanguage,
        autoPlaySpeech,
      });
    }

    const safeUser = typeof updatedUser?.toJSON === 'function' ? updatedUser.toJSON() : updatedUser;

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      settings: safeUser,
    });
  } catch (err) {
    next(err);
  }
};
