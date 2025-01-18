import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import * as ThreadService from './Thread.services';

export const createThread = catchAsync(async (req: Request, res: Response) => {
  const { type, participants, name, initialMessage } = req.body;
  const thread = await ThreadService.createThread(type, participants, name, initialMessage);
  res.status(201).json({ success: true, data: thread });
});

// get threads
export const getThreads = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.query;
  console.log("user Id",userId)
  const threads = await ThreadService.getUserThreads(userId as string);
  res.status(200).json({ success: true, data: threads });
});

export const addMessage = catchAsync(async (req: Request, res: Response) => {
  const { threadId, authorId, content, type } = req.body;
  const message = await ThreadService.addMessage(threadId, authorId, content, type);
  res.status(201).json({ success: true, data: message });
});

export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const messages = await ThreadService.getThreadMessages(threadId);
  res.status(200).json({ success: true, data: messages });
});
