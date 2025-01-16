import { Router } from 'express';
import * as ThreadController from './Thread.controllers';
import validateRequest from "../../middlewares/validateRequest";
import { createThreadValidation, addMessageValidation } from './Thread.validations';

const router = Router();

router.post('/create', ThreadController.createThread);
router.get('/', ThreadController.getThreads);
router.post('/message', ThreadController.addMessage);
router.get('/:threadId/messages', ThreadController.getMessages);

export const ThreadRoutes = router;
