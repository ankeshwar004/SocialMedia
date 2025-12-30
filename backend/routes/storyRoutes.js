import express from 'express';

import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { addUserStory, getUserStories } from '../controllers/storyController.js';

const storyRouter=Router();

storyRouter.post('/create',upload.single('media'),protect,addUserStory);
storyRouter.get('/get',protect,getUserStories);

export default storyRouter;
