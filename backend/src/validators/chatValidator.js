import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().trim().min(1, 'Message cannot be empty').max(4000, 'Message cannot exceed 4000 characters'),
  language: z.enum(['en', 'te', 'hi']).default('en'),
  conversationId: z.string().optional().nullable(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        text: z.string().optional(),
        content: z.string().optional(),
        language: z.string().optional(),
      })
    )
    .optional(),
});
