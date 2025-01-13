import { z } from 'zod';

export const createThreadValidation = z.object({
  type: z.enum(['DIRECT', 'GROUP']),
  participants: z.array(z.string().uuid()).min(2, 'A thread must have at least two participants'),
});

export const addMessageValidation = z.object({
  threadId: z.string().uuid(),
  authorId: z.string().uuid(),
  content: z.string().min(1, 'Content cannot be empty'),
  type: z.enum(['TEXT', 'IMAGE']),
});
