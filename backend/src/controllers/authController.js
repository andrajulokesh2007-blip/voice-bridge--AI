import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from '../models/User.js';
import { memoryStore } from '../services/memoryStore.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, preferredLanguage } = req.body;
    const isMongo = mongoose.connection.readyState === 1;

    let existingUser = null;
    if (isMongo) {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = await memoryStore.findUserByEmail(email);
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    let newUser = null;
    if (isMongo) {
      newUser = await User.create({
        name,
        email,
        password,
        preferredLanguage: preferredLanguage || 'en',
      });
    } else {
      newUser = await memoryStore.createUser({
        name,
        email,
        password,
        preferredLanguage,
      });
    }

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: typeof newUser.toJSON === 'function' ? newUser.toJSON() : newUser,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isMongo = mongoose.connection.readyState === 1;

    let user = null;
    if (isMongo) {
      user = await User.findOne({ email });
    } else {
      user = await memoryStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: typeof user.toJSON === 'function' ? user.toJSON() : user,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userSafe = typeof req.user.toJSON === 'function' ? req.user.toJSON() : req.user;
    res.status(200).json({
      success: true,
      user: userSafe,
    });
  } catch (err) {
    next(err);
  }
};
