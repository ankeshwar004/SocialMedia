import express from 'express';

import { Router } from 'express';
import {addPost,getPosts,likePost} from  '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/multer.js';

const postRouter = Router();

postRouter.post('/add',upload.array('images',5),protect,addPost);
postRouter.get('/feed',protect,getPosts);
postRouter.post('/like',protect,likePost);

export default postRouter;