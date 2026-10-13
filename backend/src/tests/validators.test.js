import { test, describe } from 'node:test';
import assert from 'node:assert';
import { registerSchema, loginSchema } from '../validators/authValidator.js';
import { chatSchema } from '../validators/chatValidator.js';
import { updateSettingsSchema } from '../validators/settingsValidator.js';

describe('Auth Validators', () => {
  test('should validate valid registration input', () => {
    const valid = {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'StrongPassword123!',
      preferredLanguage: 'hi',
    };
    const result = registerSchema.safeParse(valid);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data.email, 'priya@example.com');
  });

  test('should reject short passwords and invalid emails', () => {
    const invalid = {
      name: 'A',
      email: 'not-an-email',
      password: '123',
    };
    const result = registerSchema.safeParse(invalid);
    assert.strictEqual(result.success, false);
    assert.ok(result.error.issues.length >= 2);
  });

  test('should validate login credentials', () => {
    const valid = { email: 'student@voicebridge.ai', password: 'Password123' };
    const result = loginSchema.safeParse(valid);
    assert.strictEqual(result.success, true);
  });
});

describe('Chat Validators', () => {
  test('should validate user chat message with language', () => {
    const validChat = {
      message: 'నమస్కారం, నాకు కాలేజ్ ఫీజుల గురించి చెప్పండి.',
      language: 'te',
    };
    const result = chatSchema.safeParse(validChat);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data.language, 'te');
  });

  test('should reject empty chat messages', () => {
    const emptyChat = { message: '   ', language: 'en' };
    const result = chatSchema.safeParse(emptyChat);
    assert.strictEqual(result.success, false);
  });
});

describe('Settings Validators', () => {
  test('should accept valid language and autoplay preferences', () => {
    const validSettings = {
      preferredLanguage: 'te',
      autoPlaySpeech: true,
    };
    const result = updateSettingsSchema.safeParse(validSettings);
    assert.strictEqual(result.success, true);
  });
});
