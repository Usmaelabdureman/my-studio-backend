// import prisma from '../../shared/prisma';

// export const createThread = async (type: 'DIRECT' | 'GROUP', participants: string[]) => {
//   const thread = await prisma.thread.create({
//     data: {
//       type,
//       participants: {
//         create: participants.map(userId => ({ user_id: userId })),
//       },
//     },
//     include: {
//       participants: true,
//     },
//   });
//   return thread;
// };

// export const addMessage = async (threadId: string, authorId: string, content: string, type: 'TEXT' | 'IMAGE') => {
//   const message = await prisma.message.create({
//     data: {
//       thread_id: threadId,
//       author_id: authorId,
//       content,
//       type,
//     },
//   });
//   return message;
// };

// export const getThreadMessages = async (threadId: string) => {
//   const messages = await prisma.message.findMany({
//     where: { thread_id: threadId },
//     orderBy: { created_at: 'asc' },
//   });
//   return messages;
// };

import prisma from '../../shared/prisma';

/**
 * Creates a thread with participants and optionally includes an initial message.
 * @param type - The type of thread ('DIRECT' or 'GROUP').
 * @param participants - The array of participant user IDs.
 * @param initialMessage - Optional initial message with authorId, content, and type.
 * @returns The created thread object.
 */
export const createThread = async (
  type: 'DIRECT' | 'GROUP',
  participants: string[],
  initialMessage?: { authorId: string; content: string; type: 'TEXT' | 'IMAGE' }
) => {
  const thread = await prisma.thread.create({
    data: {
      type,
      participants: {
        create: participants.map((userId) => ({ user_id: userId })),
      },
      ...(initialMessage
        ? {
            messages: {
              create: {
                author_id: initialMessage.authorId,
                content: initialMessage.content,
                type: initialMessage.type,
              },
            },
          }
        : {}),
    },
    include: {
      participants: true,
      messages: true,
    },
  });
  return thread;
};

/**
 * Adds a message to an existing thread.
 * @param threadId - The ID of the thread.
 * @param authorId - The ID of the author of the message.
 * @param content - The content of the message.
 * @param type - The type of the message ('TEXT' or 'IMAGE').
 * @returns The created message object.
 */
export const addMessage = async (
  threadId: string,
  authorId: string,
  content: string,
  type: 'TEXT' | 'IMAGE'
) => {
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

/**
 * Retrieves all messages in a thread.
 * @param threadId - The ID of the thread.
 * @returns An array of messages in the thread.
 */
export const getThreadMessages = async (threadId: string) => {
  const messages = await prisma.message.findMany({
    where: { thread_id: threadId },
    orderBy: { created_at: 'asc' },
  });
  return messages;
};
