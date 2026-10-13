import { test, describe } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://127.0.0.1:5000/api';

describe('VoiceBridge AI End-to-End API Workflows', () => {
  let authToken = '';
  let conversationId = '';

  test('1. Health check returns 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.service, 'VoiceBridge AI Backend');
    assert.ok(data.uptime);
  });

  test('2. Register new student account', async () => {
    const uniqueEmail = `test_student_${Date.now()}@voicebridge.ai`;
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sai Krishna',
        email: uniqueEmail,
        password: 'Password123!',
        preferredLanguage: 'te',
      }),
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, uniqueEmail);
    assert.strictEqual(data.user.preferredLanguage, 'te');
    authToken = data.token;
  });

  test('3. Login with Demo Student credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@voicebridge.ai',
        password: 'DemoPass123!',
      }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    assert.strictEqual(data.user.email, 'student@voicebridge.ai');
  });

  test('4. Verify current user via /api/auth/me', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.name, 'Sai Krishna');
  });

  test('5. Create and fetch conversation', async () => {
    const createRes = await fetch(`${BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'College Admissions Inquiry in Telugu',
        initialMessage: 'కాలేజ్ అడ్మిషన్ల ప్రక్రియ ఎప్పుడు ప్రారంభమవుతుంది?',
      }),
    });

    assert.strictEqual(createRes.status, 201);
    const createData = await createRes.json();
    assert.ok(createData.conversation._id);
    conversationId = createData.conversation._id;

    // Fetch conversation by ID
    const getRes = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(getRes.status, 200);
    const getData = await getRes.json();
    assert.strictEqual(getData.conversation.title, 'College Admissions Inquiry in Telugu');
  });

  test('6. Fetch user settings and update preferences', async () => {
    const patchRes = await fetch(`${BASE_URL}/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        preferredLanguage: 'hi',
        autoPlaySpeech: true,
      }),
    });

    assert.strictEqual(patchRes.status, 200);
    const patchData = await patchRes.json();
    assert.strictEqual(patchData.settings.preferredLanguage, 'hi');
    assert.strictEqual(patchData.settings.autoPlaySpeech, true);
  });

  test('7. AI Chat transparently fails with clear message if GEMINI_API_KEY is not configured', async () => {
    const chatRes = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        message: 'Hello AI assistant',
        language: 'en',
      }),
    });

    // Since GEMINI_API_KEY is currently empty in .env, it must return a clear 503 error, never faking success
    assert.strictEqual(chatRes.status, 503);
    const chatData = await chatRes.json();
    assert.strictEqual(chatData.success, false);
    assert.ok(chatData.message.includes('GEMINI_API_KEY'));
  });

  test('8. Delete conversation', async () => {
    const delRes = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(delRes.status, 200);
  });
});
