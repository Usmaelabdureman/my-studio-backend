import path from 'path';
import prisma from '../../shared/prisma';
// GridFS helper replaces Supabase storage usage. See `src/app/shared/gridfs.ts`.
import gridfs from '../../shared/gridfs';
import {v4 as uuidv4} from 'uuid';
import { profile } from 'console';

export const createThread = async (
  type: 'DIRECT' | 'GROUP',
  participants: string[],
  name?: string,
  initialMessage?: { authorId: string; content: string; type: 'TEXT' | 'FILE', }
) => {
  if (type === 'GROUP' && !name) {
    name = 'Untitled Group';
  }

  if (initialMessage) {
    const { authorId, content, type: messageType } = initialMessage;
    if (!authorId || typeof authorId !== 'string') {
      throw new Error('Invalid initialMessage: "authorId" is required and must be a string');
    }
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid initialMessage: "content" is required and must be a string');
    }
    if (!messageType || (messageType !== 'TEXT' && messageType !== 'FILE')) {
      throw new Error('Invalid initialMessage: "type" must be "TEXT" or "IMAGE"');
    }
  }

  // Create thread first, then create participants and optional initial message using scalar fk fields.
  const thread = await prisma.thread.create({
    data: {
      type,
      name,
      member_count: participants.length,
    },
  });

  // Create participants separately (no nested relations in Mongo schema)
  if (participants?.length) {
    await prisma.threadParticipant.createMany({
      data: participants.map((userId) => ({ thread_id: thread.id, user_id: userId })),
      skipDuplicates: true,
    });
  }

  // Create initial message if present
  if (initialMessage) {
    await prisma.message.create({
      data: {
        thread_id: thread.id,
        author_id: initialMessage.authorId,
        content: initialMessage.content,
        type: initialMessage.type,
      },
    });
  }

  return thread;
};


export const updateThreadName = async (threadId: string, name: string) => {
  const updatedThread = await prisma.thread.update({
    where: { id: threadId },
    data: { name },
  });
  return updatedThread;
};



export const addMessage = async (threadId: string, authorId: string, content: string, type: 'TEXT' | 'FILE', file: Express.Multer.File | null) => {
  let fileUrl = null;

  if (type === 'FILE' && file) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;

    // Upload buffer to GridFS and expose a local streaming route in the app (e.g. /files/:filename)
    await gridfs.uploadFile(file.buffer, fileName, file.mimetype);
    // For GridFS we will use a local route to serve files, so build a path that the server can stream.
    fileUrl = `/files/${fileName}`;
  }

  
  const messageData = {
    thread_id: threadId,
    author_id: authorId,
    content: content || '',
    file_url: fileUrl || '', 
    type, 
  };


  const newMessage = await prisma.message.create({
    data: messageData,
  });
  await prisma.thread.update({
    where: { id: threadId },
    data: {
      unread_count:{
        increment:1
      }
     },
  });
  return newMessage;
};

// edit message

export const editMessage = async(messageId:string,newContent:string, thread_id:string,author_id:string)=>{
  const updatedMessage = await prisma.message.update({
    where: { id: messageId, thread_id: thread_id, author_id: author_id },
    data: { content: newContent,
      is_edited:true,
     },
  });
  return updatedMessage;
}

// Delete Mesage

export const deleteMessage = async(messageId:string)=>{
  const deletedMessage = await prisma.message.delete({
    where: { id: messageId },
  });
  return deletedMessage;
}

// Reply to a message

export const replyToMessage = async(threadId:string,authorId:string, parentMessageId:string,content:string)=>{
 
  const reply = await prisma.message.create({
    data: {
      thread_id: threadId,
      author_id: authorId,
      content: content,
      parent_message_id: parentMessageId,
      type: 'TEXT',
    },
  });
  return reply;
}
// comment on message
export const commentOnMessage = async (
  threadId: string,
  authorId: string,
  parentMessageId: string,
  content: string,
) => {
  return replyToMessage(threadId, authorId, parentMessageId, content);
};

// }
export const markMessagesAsRead = async (threadId: string, userId: string) => {
  await prisma.message.updateMany({
    where: {
      thread_id: threadId,
      author_id: {
        not: userId,
      },
      read_status: false,
    },
    data: { read_status: true },
  });

  const unreadMessagesCount = await prisma.message.count({
    where: {
      thread_id: threadId,
      read_status: false,
    },
  });

  await prisma.thread.update({
    where: { id: threadId },
    data: { unread_count: unreadMessagesCount },
  });
};


export const getThreadMessages = async (
  threadId: string,
  onNewMessage?: (message: any) => void
) => {
  const messages = await prisma.message.findMany({
    where: { thread_id: threadId },
    orderBy: { created_at: 'asc' },
  });

  // Fetch authors separately because relations were removed in MongoDB schema
  const authorIds = Array.from(new Set(messages.map((m) => m.author_id)));
  const authors = await prisma.user.findMany({
    where: { id: { in: authorIds } },
    select: { id: true, first_name: true, last_name: true, profile_pic: true, status: true },
  });
  const authorMap: Record<string, any> = {};
  authors.forEach((a) => {
    authorMap[a.id] = a;
  });

  return messages.map((message: any) => ({
    id: message.id,
    threadId: message.thread_id,
    content: message.content,
    createdAt: message.created_at,
    type: message.type,
    author: {
      id: message.author_id,
      name: (authorMap[message.author_id]?.first_name || '') + ' ' + (authorMap[message.author_id]?.last_name || ''),
      avatar: authorMap[message.author_id]?.profile_pic || '',
      isActive: authorMap[message.author_id]?.status,
    },
    file_url: message.file_url,
    isEdited: message.is_edited,
    parentMessageId: message.parent_message_id,
    read_status: message.read_status,
  }));
};


export const getUserThreads = async (
  userId: string,
  onNewThread?: (thread: any) => void
) => {
  // Find threadParticipant records for this user
  const participantRecords = await prisma.threadParticipant.findMany({ where: { user_id: userId } });
  const threadIds = participantRecords.map((p) => p.thread_id);

  const threads = await prisma.thread.findMany({ where: { id: { in: threadIds } } });

  // Fetch participants for all threads and user info
  const allParticipants = await prisma.threadParticipant.findMany({ where: { thread_id: { in: threadIds } } });
  const userIds = Array.from(new Set(allParticipants.map((p) => p.user_id)));
  const users = await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, first_name: true, last_name: true, profile_pic: true } });
  const userMap: Record<string, any> = {};
  users.forEach((u) => (userMap[u.id] = u));

  return threads.map((thread) => ({
    id: thread.id,
    type: thread.type || '',
    participants: allParticipants
      .filter((p) => p.thread_id === thread.id)
      .map((participant) => ({
        id: participant.user_id,
        name: `${userMap[participant.user_id]?.first_name || ''} ${userMap[participant.user_id]?.last_name || ''}`,
        avatar: userMap[participant.user_id]?.profile_pic || '',
      })),
    unreadCount: thread.unread_count || 0,
    name: thread.name || '',
    member_count: thread.member_count || 0,
  }));
};


export const getContactsByQuery = async (query: string) => {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          first_name: {
            contains: query,
          },
        },
        {
          last_name: {
            contains: query,
          },
        },
      ],
    },
  });

  return users.map((user) => ({
    id: user.email,
    name: `${user.first_name} ${user?.last_name}`,
    avatar: user.profile_pic || '',
    status: user.status,
    email: user.email,
    profile_pic: user?.profile_pic,
    isActive: user.status === 'ACTIVE',
  }));
};