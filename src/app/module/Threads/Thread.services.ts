import path from 'path';
import prisma from '../../shared/prisma';
import  supabase  from '../../shared/supabase';
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



export const addMessage = async (threadId: string, authorId: string, content: string, type: 'TEXT' | 'FILE', file: Express.Multer.File | null) => {
  let fileUrl = null;

  if (type === 'FILE' && file) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;

    const { data, error } = await supabase.storage
      .from('chat-bucket') 
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new Error('Error uploading file to Supabase');
    }
    fileUrl = supabase.storage.from('chat-bucket').getPublicUrl(fileName).data?.publicUrl;
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
    include: {
      author: {
        select: {
         id: true,
         first_name:true,
         last_name:true,
         profile_pic:true,
         status:true,
        },
      },
    },
  });

  return messages.map((message) => ({
    id: message.id,
    threadId: message.thread_id,
    content: message.content,
    createdAt: message.created_at,
    type: message.type,
    author: {
      id: message.author_id,
      name: message.author?.first_name + ' ' + message.author?.last_name,
      avatar: message.author.profile_pic || '' ,
      isActive: message.author.status,
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
  const threads = await prisma.thread.findMany({
    where: {
      participants: {
        some: {
          user_id: userId,
        },
      },
    },
    include: {
      participants: {
        select: {
          user_id: true,
          user: {
            select: {
              first_name: true,
              last_name: true,
              profile_pic: true, 
            },
          },
        },
      },
    },
  });

  // Transform the data to match frontend expectations
  return threads.map((thread) => ({
    id: thread.id,
    type: thread.type || '',
    participants: thread.participants.map((participant) => ({
      id: participant.user_id,
      name: `${participant.user?.first_name} ${participant.user?.last_name}`,
      avatar: participant?.user.profile_pic || '',
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