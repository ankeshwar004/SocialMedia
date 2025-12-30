import express from 'express';

import { Router } from 'express';
import { followUser, getUserData, unfollowUser ,updateUserData,discoverUsers,sendConnectionRequest,
    acceptConnectionRequest,getUserConnections,
    getUserProfiles
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/multer.js';
import { getUserRecentMessages } from '../controllers/MessageController.js';

const userRouter = Router();

userRouter.get('/data',protect,getUserData);
userRouter.post('/update',upload.fields([{name:'profile_picture', maxCount:1},
{ name: 'cover_photo', maxCount: 1 }]),protect,updateUserData);
userRouter.post('/discover',protect,discoverUsers);
userRouter.post('/follow',protect,followUser);
userRouter.post('/unfollow',protect,unfollowUser);
userRouter.post('/connect',protect,sendConnectionRequest);
userRouter.post('/accept',protect,acceptConnectionRequest);
userRouter.get('/connections',protect,getUserConnections);
userRouter.post('/profiles',protect,getUserProfiles);
userRouter.get('/recent-messages',protect,getUserRecentMessages);

export default userRouter;