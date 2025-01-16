"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessageValidation = exports.createThreadValidation = void 0;
const zod_1 = require("zod");
exports.createThreadValidation = zod_1.z.object({
    type: zod_1.z.enum(['DIRECT', 'GROUP']),
    participants: zod_1.z.array(zod_1.z.string().uuid()).min(2, 'A thread must have at least two participants'),
});
exports.addMessageValidation = zod_1.z.object({
    threadId: zod_1.z.string().uuid(),
    authorId: zod_1.z.string().uuid(),
    content: zod_1.z.string().min(1, 'Content cannot be empty'),
    type: zod_1.z.enum(['TEXT', 'IMAGE']),
});
