import express from 'express';

import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

import { sseConnection, sendMessage,getChatMessages,getUserRecentMessages } from '../controllers/MessageController.js';

const messageRouter=Router();

messageRouter.get("/:userId",sseConnection);
messageRouter.post("/send",upload.single('image'),protect,sendMessage);
messageRouter.post("/get",protect,getChatMessages);

export default messageRouter;
