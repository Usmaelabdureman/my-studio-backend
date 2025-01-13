import { THREAD_TYPES, MESSAGE_TYPES } from './Thread.constants';

export interface Thread {
  id: string;
  type: keyof typeof THREAD_TYPES;
  created_at: Date;
  updated_at: Date;
}

export interface ThreadParticipant {
  id: string;
  thread_id: string;
  user_id: string;
}

export interface Message {
  id: string;
  thread_id: string;
  author_id: string;
  type: keyof typeof MESSAGE_TYPES;
  content: string;
  created_at: Date;
  updated_at: Date;
}
