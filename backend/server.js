import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import conversationRoutes from './src/routes/conversationRoutes.js';
import settingsRoutes from './src/routes/settingsRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';

// Middleware
import { errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();

// 1. CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or matched origins
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/testing
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 2. Request body parser with size limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 3. Rate limiting (120 requests per 15 minutes window)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});
app.use('/api', apiLimiter);

// 4. Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected (Atlas/Mongoose)' : 'fallback (In-Memory)';
  res.status(200).json({
    status: 'ok',
    service: 'VoiceBridge AI Backend',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    database: dbStatus,
    aiConfigured: !!env.GEMINI_API_KEY,
  });
});

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/chat', chatRoutes);

// 6. 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found.`,
  });
});

// 7. Centralized Error Handler
app.use(errorHandler);

// 8. Start Server & Connect Database
const startServer = async () => {
  const server = app.listen(env.PORT, () => {
    console.log(`🚀 VoiceBridge AI Backend is running on port ${env.PORT}`);
    console.log(`🌐 Health check available at: http://localhost:${env.PORT}/api/health`);
    console.log(`🤖 AI Provider: ${env.GEMINI_API_KEY ? 'Gemini API Configured' : 'Missing GEMINI_API_KEY (Set in .env)'}`);
  });

  connectDB().catch((err) => {
    console.warn('DB initialization notice:', err.message);
  });

  const handleShutdown = () => {
    console.log('\n🛑 Gracefully shutting down server...');
    server.close(() => {
      if (mongoose.connection.readyState === 1) {
        mongoose.connection.close(false);
      }
      console.log('✅ Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
};

startServer();

export default app;
