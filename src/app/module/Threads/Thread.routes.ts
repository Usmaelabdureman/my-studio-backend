import { Router } from 'express';
import * as ThreadController from './Thread.controllers';
import validateRequest from "../../middlewares/validateRequest";
import { createThreadValidation, addMessageValidation } from './Thread.validations';

const router = Router();

router.post('/create', validateRequest(createThreadValidation), ThreadController.createThread);
router.post('/message', validateRequest(addMessageValidation), ThreadController.addMessage);
router.get('/:threadId/messages', ThreadController.getMessages);

export default router;
