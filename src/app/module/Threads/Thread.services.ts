import prisma from '../../shared/prisma';

export const createThread = async (type: 'DIRECT' | 'GROUP', participants: string[]) => {
  const thread = await prisma.thread.create({
    data: {
      type,
      participants: {
        create: participants.map(userId => ({ user_id: userId })),
      },
    },
    include: {
      participants: true,
    },
  });
  return thread;
};

export const addMessage = async (threadId: string, authorId: string, content: string, type: 'TEXT' | 'IMAGE') => {
  const message = await prisma.message.create({
    data: {
      thread_id: threadId,
      author_id: authorId,
      content,
      type,
    },
  });
  return message;
};

export const getThreadMessages = async (threadId: string) => {
  const messages = await prisma.message.findMany({
    where: { thread_id: threadId },
    orderBy: { created_at: 'asc' },
  });
  return messages;
};
