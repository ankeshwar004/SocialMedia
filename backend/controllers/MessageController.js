import fs from 'fs';
import Message from '../Models/Message.js';
import imagekit from '../config/imagekit.js';



// empty obj to store server side event connections
const connections={}

// function for SSE connection
export const sseConnection=async(req,res)=>{
    const {userId}=req.params;
    console.log("SSE Connection established for user:",userId);

    // set headers for SSE
    res.setHeader('Content-Type','text/event-stream');
    res.setHeader('Cache-Control','no-cache');
    res.setHeader('Connection','keep-alive');
    res.setHeader('Access-Control-Allow-Origin','*');

    // Add the clients response object to connections object
    connections[userId]=res;

    // Send an initial event to client
    res.write("data: SSE connection established\n\n");

    // Handle client disconnect
    req.on('close',()=>{
        console.log("SSE Connection closed for user:",userId);
        delete connections[userId];
    });

}

// Send Message
export const sendMessage=async(req,res)=>{
    try{
        const { userId } = req.auth();
        const { to_user_id,text } = req.body;
        const image=req.file;
        let media_url="";
        let message_type=image?'image':"text";

        if(message_type!=="text"){
            const fileBuffer=fs.readFileSync(image.path);
            const response=await imagekit.upload({
               file:fileBuffer,
               fileName:image.originalname,
            })
            media_url=response.url;
        }   
        const message=await Message.create({
            from_user_id:userId,
            to_user_id,
            text,
            message_type,
            media_url
        });

        res.json({ success:true,message: "Message sent successfully",message });

        // Send message to reciver using SSE
        
        const messageWithUserData=await Message.findById(message._id).populate('from_user_id').populate('to_user_id');

        if(connections[to_user_id]){
            connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserData)}\n\n`);
        }

    }catch(err){
        console.log(err);
        res.json({ success:false,message: err.message });
    }
}

// Get Messages between two users
export const getChatMessages=async(req,res)=>{
    try{
        const {userId}=req.auth();
        const {to_user_id}=req.body;
        
        const messages=await Message.find({
            $or:[
                {from_user_id:userId,to_user_id:to_user_id},
                {from_user_id:to_user_id,to_user_id:userId},
            ]
        }).sort({created_at:-1})
        // mark messages as seen
        await Message.updateMany({from_user_id:to_user_id,to_user_id:userId},{seen:true})
        res.json({ success:true,messages });

    }catch(err){
        console.log(err);
        res.json({ success:false,message: err.message });
    }
}

// Get Recent Messages
export const getUserRecentMessages=async(req,res)=>{
    try{
         const {userId}=req.auth();
         const message=await Message.find({to_user_id:userId}).populate("from_user_id to_user_id").sort({createdAt:-1});
         res.json({success:true,message});
    }catch(err){
        console.log(err);
        res.json({ success:false,message: err.message });
    }
}