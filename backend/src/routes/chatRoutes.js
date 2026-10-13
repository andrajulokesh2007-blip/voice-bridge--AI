import { Router } from 'express';
import { handleChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { chatSchema } from '../validators/chatValidator.js';

const router = Router();

router.post('/', protect, validate(chatSchema), handleChat);

export default router;
