import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { updateSettingsSchema } from '../validators/settingsValidator.js';

const router = Router();

router.use(protect);

router.get('/', getSettings);
router.patch('/', validate(updateSettingsSchema), updateSettings);

export default router;
