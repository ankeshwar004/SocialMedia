import fs from 'fs';
import imagekit from '../config/imagekit.js';
import Post from '../Models/Post.js';
import User from '../Models/User.js';

// Add Post
export const addPost = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { content, post_type } = req.body;
        const images = req.files;
        let image_urls = [];

        if (images.length > 0) {
            image_urls = await Promise.all(
                images.map(async (image) => {
                    const fileBuffer = fs.readFileSync(image.path);
                    const response = await imagekit.upload({
                        file: fileBuffer,
                        fileName: image.originalname,
                        folder: 'posts',
                    });
                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: "auto" },
                            { format: 'webp' },
                            { width: "1280" }
                        ]
                    });
                    return url; 
                })
            )
        }
        await Post.create({
            user:userId,
            content,
            image_urls,
            post_type
        })
        res.json({ success:true,message: "Post created successfully" });
    } catch (err) {
        console.log(err);
        res.json({ success:false,message: err.message });
    }
}

// Get Posts
export const getPosts = async (req, res) => {
    try{
        const { userId } = req.auth();
        const user=await User.findById(userId);

        // user connections and followings
        const userIds=[userId,...user.connections,...user.followings];
        const posts=await Post.find({user:{$in:userIds}}).populate('user').sort({createdAt:-1});

        res.json({ success:true,posts });

    }catch(err){
         console.log(err);
        res.json({ success:false,message: err.message });
    }
}

// Like/Unlike Post
export const likePost = async (req, res) => {
    try{
        const { userId } = req.auth();
        const {postId}=req.body;
        const post=await Post.findById(postId);

        if(post.likes_count.includes(userId)){
            // unlike
            post.likes_count=post.likes_count.filter(user=>user!==userId);
        }else{
            // like
            post.likes_count.push(userId);
        }
        await post.save();

        res.json({ success:true,message: "Post like status updated successfully" });

    }catch(err){
         console.log(err);
        res.json({ success:false,message: err.message });
    }
}