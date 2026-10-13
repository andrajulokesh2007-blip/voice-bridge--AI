import { z } from 'zod';

export const updateSettingsSchema = z.object({
  preferredLanguage: z.enum(['en', 'te', 'hi']).optional(),
  autoPlaySpeech: z.boolean().optional(),
});
