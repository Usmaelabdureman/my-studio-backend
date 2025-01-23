"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.commentOnMessage = exports.markAsRead = exports.replyToMessage = exports.deleteMessage = exports.editMessage = exports.getMessages = exports.addMessage = exports.getThreads = exports.createThread = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const ThreadService = __importStar(require("./Thread.services"));
exports.createThread = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, participants, name, initialMessage } = req.body;
    const thread = yield ThreadService.createThread(type, participants, name, initialMessage);
    res.status(201).json({ success: true, data: thread });
}));
// get threads
exports.getThreads = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.query;
    // console.log("user Id",userId)
    const threads = yield ThreadService.getUserThreads(userId);
    res.status(200).json({ success: true, data: threads });
}));
exports.addMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId, authorId, content, type } = req.body;
    const file = req === null || req === void 0 ? void 0 : req.file;
    // console.log("data in control", req.body);
    const message = yield ThreadService.addMessage(threadId, authorId, content, type, file !== null && file !== void 0 ? file : null);
    res.status(201).json({ success: true, data: message });
}));
exports.getMessages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId } = req.params;
    const messages = yield ThreadService.getThreadMessages(threadId);
    res.status(200).json({ success: true, data: messages });
}));
exports.editMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId, newContent, thread_id, author_id } = req.body;
    const updatedMessage = yield ThreadService.editMessage(messageId, newContent, thread_id, author_id);
    res.status(200).json({ success: true, data: updatedMessage });
}));
exports.deleteMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.body;
    const deletedMessage = yield ThreadService.deleteMessage(messageId);
    res.status(200).json({ success: true, data: deletedMessage });
}));
exports.replyToMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId, authorId, parentMessageId, content } = req.body;
    const reply = yield ThreadService.replyToMessage(threadId, authorId, parentMessageId, content);
    res.status(201).json({ success: true, data: reply });
}));
// export const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
//   const { threadId, userId } = req.query;
//   const unreadCount = await ThreadService.getUnreadMessages(threadId as string, userId as string);
//   res.status(200).json({ success: true, data: { unreadCount } });
// });
exports.markAsRead = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId, userId } = req.body;
    yield ThreadService.markMessagesAsRead(threadId, userId);
    res.status(200).json({ success: true, message: 'Thread marked as read' });
}));
exports.commentOnMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { threadId, authorId, parentMessageId, content } = req.body;
    const comment = yield ThreadService.commentOnMessage(threadId, authorId, parentMessageId, content);
    res.status(201).json({ success: true, data: comment });
}));
