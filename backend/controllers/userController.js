import { format } from "path";
import User from "../Models/User.js";
import imagekit from "../config/imagekit.js";
import fs, { stat } from "fs";
import Connection from "../Models/Connection.js";
import Post from "../Models/Post.js";
import { inngest } from "../inngest/index.js";

// Get UserData from UserId
export const getUserData=async(req,res)=>{
    try{
        const auth = await req.auth();
        const {userId} = auth;
        let user=await User.findById(userId);
        if(!user){
            // Create user if doesn't exist (fallback if Inngest webhook didn't fire)
            const claims = auth.sessionClaims || {};
            const email = claims.email || claims.primary_email_address || '';
            const firstName = claims.first_name || '';
            const lastName = claims.last_name || '';
            const fullName = claims.name || `${firstName} ${lastName}`.trim() || 'User';
            const username = claims.username || email.split('@')[0] || `user_${userId.slice(-8)}`;
            const imageUrl = claims.image_url || claims.picture || '';
            
            // Check if username already exists
            let finalUsername = username;
            const existingUser = await User.findOne({username: finalUsername});
            if(existingUser){
                finalUsername = `${username}_${Math.floor(Math.random()*1000)}`;
            }
            
            user = new User({
                _id: userId,
                email: email || `${userId}@temp.com`,
                full_name: fullName,
                username: finalUsername,
                profile_picture: imageUrl
            });
            
            await user.save();
        }
        return res.json({success:true, user });
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// Update User Data
export const updateUserData=async(req,res)=>{
    try{
        const {userId}=await req.auth();
        let {username,bio,location,full_name}=req.body;
        const tempuser=await User.findById(userId);

        !username && (username=tempuser.username);
        
        if(tempuser.username!==username){
            const existingUser=await User.findOne({username});
            if(existingUser){
                username=tempuser.username;
                console.log("Username already taken");
            }
        }
        const updatedData={
            username,
            bio,
            location,
            full_name
        }
        
        const profile=req.files.profile?.[0];
        const cover=req.files.cover?.[0];

        if(profile){
            const buffer=fs.readFileSync(profile.path);
            const response=await imagekit.upload({
                file:buffer,
                fileName:profile.originalname,
            });
            const url=imagekit.url({
                path:response.filePath,
                transformation:[
                    {quality:"auto"},
                    {format:'webp'},
                    {width:"512"}
                ]
            });
            updatedData.profile_picture=url;
        }

        if(cover){
            const buffer=fs.readFileSync(cover.path);
            const response=await imagekit.upload({
                file:buffer,
                fileName:cover.originalname,
            });
            const url=imagekit.url({
                path:response.filePath,
                transformation:[
                    {quality:"auto"},
                    {format:'webp'},
                    {width:"1280"}
                ]
            });
            updatedData.cover_photo=url;
        }

       const user= await User.findByIdAndUpdate(userId, updatedData, {new:true});

        res.json({success:true,user,message:"Profile Updated Successfully"});

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// Find User from username,email,location,name
export const discoverUsers=async(req,res)=>{
    try{
        const {userId}=await req.auth();
        const {input}=await req.body;
        
        const allUsers=await User.find(
            {
                $or:[
                    {username:new RegExp(input,'i')},
                    {email:new RegExp(input,'i')},
                    {full_name:new RegExp(input,'i')},
                    {location:new RegExp(input,'i')},
                ]
            }
        )

        const filterUsers=allUsers.filter((user)=>user._id!==userId);

        return res.json({success:true, users:filterUsers,message:"Users fetched successfully"});

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// Follow User
export const followUser=async(req,res)=>{
        try{
            const {userId}=await req.auth();
            const{id}=req.body;

            const user=await User.findById(userId);

            if(user.followings.includes(id)){
                return res.json({success:false, message:"Already Followings"});
            }
            
            user.followings.push(id);
            await user.save();

            const toUser=await User.findById(id);
            toUser.followers.push(userId);
            await toUser.save();

            return res.json({success:true, message:"Now Followings"});


        } catch (error) {
            console.log(error);
            return res.json({success:false, message:error.message});
        }
}

// Unfollow User
export const unfollowUser=async(req,res)=>{
 try{
            const {userId}=await req.auth();
            const{id}=req.body;

            const user=await User.findById(userId);

            if(!user.followings.includes(id)){
                return res.json({success:false, message:"Not Followings"});
            }

            user.followings.pull(id);
            await user.save();

            const toUser=await User.findById(id);
            toUser.followers.pull(userId);
            await toUser.save();

            return res.json({success:true, message:"Unfollowed Successfully"});


        } catch (error) {
            console.log(error);
            return res.json({success:false, message:error.message});
        }
}

// Send Connection Request
export const sendConnectionRequest=async(req,res)=>{
    try{
        const {userId}=await req.auth(); //own id
        const {id}=req.body;  //other user id
        
        // Checking if user already send more than 20 connections in last 24 hours
        const last24hr= new Date(Date.now() - 24*60*60*1000);
        const connectionRequests=await Connection.countDocuments({
            from_user_id:userId,
            createdAt:{$gte:last24hr}
        });
        if(connectionRequests>=20){
            return res.json({success:false,message:"Connection request limit reached. Try again later."});
        }
        // if user already connected
        const existingConnection=await Connection.findOne(
            {
                $or:[
                    {from_user_id:userId,to_user_id:id},
                    {from_user_id:id,to_user_id:userId}]
            }
        )
        if(!existingConnection){
            const newConnection=await Connection.create({
                from_user_id:userId,
                to_user_id:id
            })

            await inngest.send({
                name:"app/connection-request",
                data:{conectionId:newConnection._id}
            })

            return res.json({success:true,message:"Connection Request Sent Successfully"});
        }else if(existingConnection && existingConnection.status==='accepted'){
            return res.json({success:false,message:"You are already connected"});
        }
        return res.json({success:false,message:"Connection Request already sent"});

    }catch(err){
        console.log(err);
        return res.json({success:false,message:err.message});
    }
}

// Get User Connections
export const getUserConnections=async(req,res)=>{
    try{
        const {userId}=await req.auth();
        const user=await User.findById(userId).populate('connections followers followings');

        const connections=user.connections;
        const followers=user.followers;
        const followings=user.followings;

        const requests = await Connection.find({
          to_user_id: userId,
          status: 'pending'
        }).populate('from_user_id');

        const pendingConnections = requests.map(conn => conn.from_user_id); 

        return res.json({success:true,connections,followers,followings,pendingConnections});
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// Accept Connection Request
export const acceptConnectionRequest=async(req,res)=>{
    try{
        const {userId}=await req.auth();
        const {id}=req.body;
        const connection=await Connection.findOne({
            from_user_id:id,
            to_user_id:userId,});
        
        if(!connection){
           return res.json({success:false,message:"No Connection Request Found"});
        }

        const user=await User.findById(userId);
        user.connections.push(id);
        await user.save(); 

        const fromUser=await User.findById(id);
        fromUser.connections.push(userId);
        await fromUser.save();

        connection.status='accepted';
        await connection.save();

        return res.json({success:true,message:"Connection Request Accepted Successfully"});
        
    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// Get User Profile
export const getUserProfiles=async(req,res)=>{
    try{
        const {userId}=await req.auth();
        const {profileId}=req.body;
        const profile =await User.findById(profileId);
        if(!profile){
            return res.json({success:false,message:"User not found"});
        }
        const posts=await Post.find({user:profileId}).populate('user');
        
        res.json({success:true,profile,posts})

    }catch(error){

    }
}
