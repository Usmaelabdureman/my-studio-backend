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


// export const addMessage = async (
//   threadId: string,
//   authorId: string,
//   content: string,
//   type: 'TEXT' | 'IMAGE'
// ) => {
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
    type, // Type can be 'TEXT' or 'FILE'
  };

  // Save the message to the database using Prisma
  // console.log("messageData",messageData)
  const newMessage = await prisma.message.create({
    data: messageData,
  });

  return newMessage;
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
