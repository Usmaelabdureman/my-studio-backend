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
exports.getContactsByQuery = exports.getUserThreads = exports.getThreadMessages = exports.markMessagesAsRead = exports.commentOnMessage = exports.replyToMessage = exports.deleteMessage = exports.editMessage = exports.addMessage = exports.updateThreadName = exports.createThread = void 0;
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const supabase_1 = __importDefault(require("../../shared/supabase"));
const uuid_1 = require("uuid");
const createThread = (type, participants, name, initialMessage) => __awaiter(void 0, void 0, void 0, function* () {
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
const addMessage = (threadId, authorId, content, type, file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let fileUrl = null;
    if (type === 'FILE' && file) {
        const fileExt = path_1.default.extname(file.originalname);
        const fileName = `${(0, uuid_1.v4)()}${fileExt}`;
        const { data, error } = yield supabase_1.default.storage
            .from('chat-bucket')
            .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });
        if (error) {
            throw new Error('Error uploading file to Supabase');
        }
        fileUrl = (_a = supabase_1.default.storage.from('chat-bucket').getPublicUrl(fileName).data) === null || _a === void 0 ? void 0 : _a.publicUrl;
    }
    const messageData = {
        thread_id: threadId,
        author_id: authorId,
        content: content || '',
        file_url: fileUrl || '',
        type,
    };
    const newMessage = yield prisma_1.default.message.create({
        data: messageData,
    });
    yield prisma_1.default.thread.update({
        where: { id: threadId },
        data: {
            unread_count: {
                increment: 1
            }
        },
    });
    return newMessage;
});
exports.addMessage = addMessage;
// edit message
const editMessage = (messageId, newContent, thread_id, author_id) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedMessage = yield prisma_1.default.message.update({
        where: { id: messageId, thread_id: thread_id, author_id: author_id },
        data: { content: newContent,
            is_edited: true,
        },
    });
    return updatedMessage;
});
exports.editMessage = editMessage;
// Delete Mesage
const deleteMessage = (messageId) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedMessage = yield prisma_1.default.message.delete({
        where: { id: messageId },
    });
    return deletedMessage;
});
exports.deleteMessage = deleteMessage;
// Reply to a message
const replyToMessage = (threadId, authorId, parentMessageId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield prisma_1.default.message.create({
        data: {
            thread_id: threadId,
            author_id: authorId,
            content: content,
            parent_message_id: parentMessageId,
            type: 'TEXT',
        },
    });
    return reply;
});
exports.replyToMessage = replyToMessage;
// comment on message
const commentOnMessage = (threadId, authorId, parentMessageId, content) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.replyToMessage)(threadId, authorId, parentMessageId, content);
});
exports.commentOnMessage = commentOnMessage;
// }
const markMessagesAsRead = (threadId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.message.updateMany({
        where: {
            thread_id: threadId,
            author_id: {
                not: userId,
            },
            read_status: false,
        },
        data: { read_status: true },
    });
    const unreadMessagesCount = yield prisma_1.default.message.count({
        where: {
            thread_id: threadId,
            read_status: false,
        },
    });
    yield prisma_1.default.thread.update({
        where: { id: threadId },
        data: { unread_count: unreadMessagesCount },
    });
});
exports.markMessagesAsRead = markMessagesAsRead;
const getThreadMessages = (threadId, onNewMessage) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield prisma_1.default.message.findMany({
        where: { thread_id: threadId },
        orderBy: { created_at: 'asc' },
        include: {
            author: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    profile_pic: true,
                    status: true,
                },
            },
        },
    });
    return messages.map((message) => {
        var _a, _b;
        return ({
            id: message.id,
            threadId: message.thread_id,
            content: message.content,
            createdAt: message.created_at,
            type: message.type,
            author: {
                id: message.author_id,
                name: ((_a = message.author) === null || _a === void 0 ? void 0 : _a.first_name) + ' ' + ((_b = message.author) === null || _b === void 0 ? void 0 : _b.last_name),
                avatar: message.author.profile_pic || '',
                isActive: message.author.status,
            },
            file_url: message.file_url,
            isEdited: message.is_edited,
            parentMessageId: message.parent_message_id,
            read_status: message.read_status,
        });
    });
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
        participants: thread.participants.map((participant) => {
            var _a, _b;
            return ({
                id: participant.user_id,
                name: `${(_a = participant.user) === null || _a === void 0 ? void 0 : _a.first_name} ${(_b = participant.user) === null || _b === void 0 ? void 0 : _b.last_name}`,
                avatar: (participant === null || participant === void 0 ? void 0 : participant.user.profile_pic) || '',
            });
        }),
        unreadCount: thread.unread_count || 0,
        name: thread.name || '',
        member_count: thread.member_count || 0,
    }));
});
exports.getUserThreads = getUserThreads;
const getContactsByQuery = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany({
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
        name: `${user.first_name} ${user === null || user === void 0 ? void 0 : user.last_name}`,
        avatar: user.profile_pic || '',
        status: user.status,
        email: user.email,
        profile_pic: user === null || user === void 0 ? void 0 : user.profile_pic,
        isActive: user.status === 'ACTIVE',
    }));
});
exports.getContactsByQuery = getContactsByQuery;
