import bcrypt from 'bcryptjs';

// In-memory fallback repository when MongoDB connection is not active
class MemoryStore {
  constructor() {
    this.users = [];
    this.conversations = [];
    this.init();
  }

  async init() {
    // Seed demo account
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('DemoPass123!', salt);

    this.users.push({
      _id: 'demo_user_123',
      name: 'Demo Student',
      email: 'student@voicebridge.ai',
      password: passwordHash,
      preferredLanguage: 'te',
      autoPlaySpeech: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async function (candidate) {
        return bcrypt.compare(candidate, this.password);
      },
      toJSON: function () {
        const copy = { ...this };
        delete copy.password;
        return copy;
      },
    });
  }

  // User operations
  async findUserByEmail(email) {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  }

  async findUserById(id) {
    const user = this.users.find((u) => u._id.toString() === id.toString());
    return user || null;
  }

  async createUser({ name, email, password, preferredLanguage }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = {
      _id: `mem_user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      preferredLanguage: preferredLanguage || 'en',
      autoPlaySpeech: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async function (candidate) {
        return bcrypt.compare(candidate, this.password);
      },
      toJSON: function () {
        const copy = { ...this };
        delete copy.password;
        return copy;
      },
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id, updates) {
    const user = await this.findUserById(id);
    if (!user) return null;
    if (updates.preferredLanguage !== undefined) user.preferredLanguage = updates.preferredLanguage;
    if (updates.autoPlaySpeech !== undefined) user.autoPlaySpeech = updates.autoPlaySpeech;
    user.updatedAt = new Date();
    return user;
  }

  // Conversation operations
  async findConversationsByUserId(userId) {
    return this.conversations
      .filter((c) => c.userId.toString() === userId.toString())
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async findConversationById(id) {
    return this.conversations.find((c) => c._id.toString() === id.toString()) || null;
  }

  async createConversation({ userId, title, initialMessage, language }) {
    const messages = [];
    if (initialMessage) {
      messages.push({
        role: 'user',
        text: initialMessage,
        language: language || 'en',
        timestamp: new Date(),
      });
    }

    const newConv = {
      _id: `mem_conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: userId.toString(),
      title: title || 'New Conversation',
      messages,
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function () {
        this.updatedAt = new Date();
        return this;
      },
    };

    this.conversations.push(newConv);
    return newConv;
  }

  async deleteConversation(id) {
    const index = this.conversations.findIndex((c) => c._id.toString() === id.toString());
    if (index !== -1) {
      this.conversations.splice(index, 1);
      return true;
    }
    return false;
  }
}

export const memoryStore = new MemoryStore();
export default memoryStore;
