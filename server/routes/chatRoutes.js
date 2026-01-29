import express from 'express';
import { createChat, deleteChat, getChats } from '../controllers/chatController.js';
import { textMessageController, imageMessageController } from '../controllers/messageController.js';
import { protect } from '../middlewares/auth.js';

const chatRouter = express.Router();

chatRouter.get('/create', protect, createChat)
chatRouter.get('/get', protect, getChats)
chatRouter.post('/delete', protect, deleteChat)
chatRouter.post('/text', protect, textMessageController)
chatRouter.post('/image', protect, imageMessageController)

export default chatRouter;