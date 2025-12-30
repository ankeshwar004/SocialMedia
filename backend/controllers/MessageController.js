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

    // Send an initial event to client (SSE formatted)
    res.write('event: log\n');
    res.write('data: Connected to SSE server\n\n');

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
        const media=req.file;
        let media_url="";
        let message_type=media? (media.mimetype?.startsWith('video/') ? 'video' : 'image') : "text";

        if(message_type!=="text" && media){
            const fileBuffer=fs.readFileSync(media.path);
            const response=await imagekit.upload({
               file:fileBuffer,
               fileName:media.originalname,
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
            const sseMessage=`data: ${JSON.stringify({ type: 'message', ...messageWithUserData.toObject() })}\n\n`;
            connections[to_user_id].write(sseMessage);

            // mark as delivered and notify sender
            await Message.findByIdAndUpdate(message._id,{ delivered:true });
            if(connections[userId]){
                const statusUpdate={ type:'status', updates:[{ _id: message._id, delivered:true }] };
                connections[userId].write(`data: ${JSON.stringify(statusUpdate)}\n\n`);
            }
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
        // mark messages as seen and notify sender via SSE
        const unseen=await Message.find({from_user_id:to_user_id,to_user_id:userId,seen:false}).select('_id');
        if(unseen.length>0){
            await Message.updateMany({from_user_id:to_user_id,to_user_id:userId},{seen:true});
            // Notify sender (the other user) that these messages are seen
            const senderId=to_user_id;
            if(connections[senderId]){
                const updates=unseen.map(m=>({ _id: m._id, seen:true }));
                const statusUpdate={ type:'status', updates };
                connections[senderId].write(`data: ${JSON.stringify(statusUpdate)}\n\n`);
            }
        }
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