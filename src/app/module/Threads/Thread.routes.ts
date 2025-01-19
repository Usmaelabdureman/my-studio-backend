import { Router } from 'express';
import * as ThreadController from './Thread.controllers';
import validateRequest from "../../middlewares/validateRequest";
import { createThreadValidation, addMessageValidation } from './Thread.validations';
import { fileUploader } from '../../utils/fileUploader';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post('/create', ThreadController.createThread);
router.get('/', ThreadController.getThreads);
router.post('/message', upload.single('file'), ThreadController.addMessage);
router.get('/:threadId/messages', ThreadController.getMessages);

export const ThreadRoutes = router;
