import { Router } from 'express';
import {
  getConversations,
  createConversation,
  getConversationById,
  deleteConversation,
} from '../controllers/conversationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id', getConversationById);
router.delete('/:id', deleteConversation);

export default router;
