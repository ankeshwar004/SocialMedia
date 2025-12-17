import fs from 'fs';
import Story from '../Models/Story.js';
import imagekit from '../config/imagekit.js';
import User from '../Models/User.js';
import { inngest } from '../inngest/index.js';

// Add Story
export const addUserStory=async(req,res)=>{
    try{
        const { userId } = req.auth();
        const {content,media_type,background_color}=req.body;
        const media=req.file;
        let media_url="";

        if(media_type==="image" || media_type==="video"){
         const fileBuffer=fs.readFileSync(media.path);
         const response=await imagekit.upload({
            file:fileBuffer,
            fileName:media.originalname,
         })  
        //  this only if url transformation is needed 
        //  media_url=imagekit.url({
        //     path: response.filePath,
        //                 transformation: [
        //                     { quality: "auto" },
        //                     { format: 'webp' },
        //                     { width: "1280" }
        //                 ]
        //  });
        // without transformation
        // recommended
        media_url=response.url;
        }

        const story=await Story.create({
            user:userId,
            content,
            media_urls:media_url,
            media_type,
            background_color
        })

        // Schedule story deletion after 24 hours using inngest
        await inngest.send({
            name:"app/story.delete",
            data:{ storyId:story._id }
        })

        res.json({ success:true,message: "Story added successfully",story });

    }catch(err){
        console.log(err);
        res.json({ success:false,message: err.message });
    }
}

// Get User Stories
export const getUserStories=async(req,res)=>{
    try{
        const { userId } = req.auth();
        const user=await User.findById(userId);
        // user connections and followings
        const userIds=[userId,...user.connections,...user.followings];
        const stories=await Story.find({user:{$in:userIds}}).populate('user').sort({createdAt:-1});

        res.json({ success:true,stories });

    }catch(err){
        console.log(err);
        res.json({ success:false,message: err.message });
    }
}