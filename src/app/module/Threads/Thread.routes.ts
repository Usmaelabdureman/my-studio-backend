import { Router } from 'express';
import * as ThreadController from './Thread.controllers';
import validateRequest from "../../middlewares/validateRequest";
import { createThreadValidation, addMessageValidation } from './Thread.validations';

import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post('/create', ThreadController.createThread);
router.get('/', ThreadController.getThreads);
router.post('/message', upload.single('file'), ThreadController.addMessage);
router.get('/:threadId/messages', ThreadController.getMessages);
router.put('/message/edit', ThreadController.editMessage);
router.delete('/message/delete', ThreadController.deleteMessage);
router.post('/message/reply', ThreadController.replyToMessage);
router.post('/thread/mark-as-read', ThreadController.markAsRead);
router.post('/message/comment', ThreadController.commentOnMessage);
router.get('/contacts', ThreadController.getContacts);

export const ThreadRoutes = router;
