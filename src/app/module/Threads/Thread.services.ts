import path from 'path';
import prisma from '../../shared/prisma';
import  supabase  from '../../shared/supabase';
import {v4 as uuidv4} from 'uuid';

export const createThread = async (
  type: 'DIRECT' | 'GROUP',
  participants: string[],
  name?: string,
  initialMessage?: { authorId: string; content: string; type: 'TEXT' | 'FILE', }
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

  // If the type is "FILE", we handle file upload to Supabase
  if (type === 'FILE' && file) {
    // Generate a unique filename using current timestamp and file extension
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('general') 
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new Error('Error uploading file to Supabase');
    }

    // Get the public URL for the uploaded file
    fileUrl = supabase.storage.from('general').getPublicUrl(fileName).data?.publicUrl;
  }

  
  // Create the message data (whether it is text or file)
  const messageData = {
    thread_id: threadId,
    author_id: authorId,
    content: content || '', // Content can be empty if only a file is uploaded
    file_url: fileUrl || '', // Store file URL if file exists
    type, 
  };

  // Save the message to the database using Prisma
  // console.log("messageData",messageData)
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

// get unread messages

// export const getUnreadMessages = async(threadId: string, userId: string)=>{
//   const unreadCount = await prisma.message.findMany({
//     where: {
//       thread_id: threadId,
//       author_id: {
//         not: userId,
//       },
//       read_status: false,
//     },
//   });
//   return unreadCount;
// }
export const markMessagesAsRead = async (threadId: string, userId: string) => {
  // Mark all messages as read for the user in this thread
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

  // Update the unread count in the thread
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


export const getThreadMessages = async (threadId: string, onNewMessage?: (message: any) => void) => {
  const messages = await prisma.message.findMany({
    where: { thread_id: threadId },
    orderBy: { created_at: 'asc' },
  });


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



  return threads;
};
