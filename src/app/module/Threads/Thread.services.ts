import prisma from '../../shared/prisma';
import  supabase  from '../../shared/supabase';

export const createThread = async (
  type: 'DIRECT' | 'GROUP',
  participants: string[],
  name?: string,
  initialMessage?: { authorId: string; content: string; type: 'TEXT' | 'IMAGE' }
) => {
  // Ensure name is set for GROUP threads
  if (type === 'GROUP' && !name) {
    name = 'Untitled Group';
  }

  // Validate initialMessage
  if (initialMessage) {
    const { authorId, content, type: messageType } = initialMessage;
    if (!authorId || typeof authorId !== 'string') {
      throw new Error('Invalid initialMessage: "authorId" is required and must be a string');
    }
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid initialMessage: "content" is required and must be a string');
    }
    if (!messageType || (messageType !== 'TEXT' && messageType !== 'IMAGE')) {
      throw new Error('Invalid initialMessage: "type" must be "TEXT" or "IMAGE"');
    }
  }

  const thread = await prisma.thread.create({
    data: {
      type,
      name,
      member_count: participants.length,
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


export const updateThreadName = async (threadId: string, name: string) => {
  const updatedThread = await prisma.thread.update({
    where: { id: threadId },
    data: { name },
  });

  await supabase.from('threads').update({ name }).eq('id', threadId);

  return updatedThread;
};


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

  // Sync message to Supabase
  await supabase.from('messages').insert({
    thread_id: threadId,
    author_id: authorId,
    content,
    type,
    created_at: new Date().toISOString(),
  });

  return message;
};


export const getThreadMessages = async (threadId: string, onNewMessage?: (message: any) => void) => {
  const messages = await prisma.message.findMany({
    where: { thread_id: threadId },
    orderBy: { created_at: 'asc' },
  });

  if (onNewMessage) {
    supabase
      .channel(`thread:${threadId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` },
        (payload) => {
          onNewMessage(payload.new);
        }
      )
      .subscribe();
  }

  return messages;
};


export const getUserThreads = async (userId: string, onNewThread?: (thread: any) => void) => {
  const threads = await prisma.thread.findMany({
    where: {
      participants: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      participants: true,
      messages: {
        orderBy: { created_at: 'asc' },
      },
    },
  });

  // If a real-time listener is needed
  if (onNewThread) {
    supabase
      .channel(`user:${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'threads', filter: `participants=like.%${userId}%` },
        (payload) => {
          onNewThread(payload.new);
        }
      )
      .subscribe();
  }

  return threads;
};
