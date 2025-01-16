"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserThreads = exports.getThreadMessages = exports.addMessage = exports.updateThreadName = exports.createThread = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const supabase_1 = __importDefault(require("../../shared/supabase"));
const createThread = (type, participants, name, initialMessage) => __awaiter(void 0, void 0, void 0, function* () {
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
    const thread = yield prisma_1.default.thread.create({
        data: Object.assign({ type,
            name, member_count: participants.length, participants: {
                create: participants.map((userId) => ({ user_id: userId })),
            } }, (initialMessage
            ? {
                messages: {
                    create: {
                        author_id: initialMessage.authorId,
                        content: initialMessage.content,
                        type: initialMessage.type,
                    },
                },
            }
            : {})),
        include: {
            participants: true,
            messages: true,
        },
    });
    return thread;
});
exports.createThread = createThread;
const updateThreadName = (threadId, name) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedThread = yield prisma_1.default.thread.update({
        where: { id: threadId },
        data: { name },
    });
    yield supabase_1.default.from('threads').update({ name }).eq('id', threadId);
    return updatedThread;
});
exports.updateThreadName = updateThreadName;
const addMessage = (threadId, authorId, content, type) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield prisma_1.default.message.create({
        data: {
            thread_id: threadId,
            author_id: authorId,
            content,
            type,
        },
    });
    // Sync message to Supabase
    yield supabase_1.default.from('messages').insert({
        thread_id: threadId,
        author_id: authorId,
        content,
        type,
        created_at: new Date().toISOString(),
    });
    return message;
});
exports.addMessage = addMessage;
const getThreadMessages = (threadId, onNewMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma_1.default.message.findMany({
        where: { thread_id: threadId },
        orderBy: { created_at: 'asc' },
    });
    if (onNewMessage) {
        supabase_1.default
            .channel(`thread:${threadId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${threadId}` }, (payload) => {
            onNewMessage(payload.new);
        })
            .subscribe();
    }
    return messages;
});
exports.getThreadMessages = getThreadMessages;
const getUserThreads = (userId, onNewThread) => __awaiter(void 0, void 0, void 0, function* () {
    const threads = yield prisma_1.default.thread.findMany({
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
        supabase_1.default
            .channel(`user:${userId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'threads', filter: `participants=like.%${userId}%` }, (payload) => {
            onNewThread(payload.new);
        })
            .subscribe();
    }
    return threads;
});
exports.getUserThreads = getUserThreads;
