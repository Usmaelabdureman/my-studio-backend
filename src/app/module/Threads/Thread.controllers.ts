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
  // console.log("user Id",userId)
  const threads = await ThreadService.getUserThreads(userId as string);
  res.status(200).json({ success: true, data: threads });
});

export const addMessage = catchAsync(async (req: Request, res: Response) => {
  const { threadId, authorId, content, type } = req.body;
  const file = req?.file;

  // console.log("data in control", req.body);

  const message = await ThreadService.addMessage(threadId, authorId, content, type, file ?? null);
  res.status(201).json({ success: true, data: message });
});

export const getMessages = catchAsync(async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const messages = await ThreadService.getThreadMessages(threadId);
  res.status(200).json({ success: true, data: messages });
});

export const editMessage = catchAsync(async (req: Request, res: Response) => {
  const { messageId, newContent , thread_id,author_id} = req.body;
  const updatedMessage = await ThreadService.editMessage(messageId, newContent,thread_id,author_id);
  res.status(200).json({ success: true, data: updatedMessage });
});

export const deleteMessage = catchAsync(async (req: Request, res: Response) => {
  const { messageId } = req.body;
  const deletedMessage = await ThreadService.deleteMessage(messageId);
  res.status(200).json({ success: true, data: deletedMessage });
});

export const replyToMessage = catchAsync(async (req: Request, res: Response) => {
  const { threadId, authorId, parentMessageId, content } = req.body;
  const reply = await ThreadService.replyToMessage(threadId, authorId, parentMessageId, content);
  res.status(201).json({ success: true, data: reply });
});

// export const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
//   const { threadId, userId } = req.query;
//   const unreadCount = await ThreadService.getUnreadMessages(threadId as string, userId as string);
//   res.status(200).json({ success: true, data: { unreadCount } });
// });

export const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { threadId, userId } = req.body;
  await ThreadService.markMessagesAsRead(threadId, userId);
  res.status(200).json({ success: true, message: 'Thread marked as read' });
});

export const commentOnMessage = catchAsync(async (req: Request, res: Response) => {
  const { threadId, authorId, parentMessageId, content } = req.body;
  const comment = await ThreadService.commentOnMessage(threadId, authorId, parentMessageId, content);
  res.status(201).json({ success: true, data: comment });
});

//  get contacts by query string

export const getContacts = catchAsync(async (req: Request, res: Response) => {
  const { query } = req.query;
  const contacts = await ThreadService.getContactsByQuery(query as string);
  res.status(200).json({ success: true, data: contacts });
}
);