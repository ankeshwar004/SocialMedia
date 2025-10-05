import {Inngest} from "inngest";
import User from "../Models/User.js";

export const inngest = new Inngest({ id: "Social-Media" });

// Ingestion function to save user to database

const SaveUserData=inngest.createFunction(
  { id: "Save User Data From Clerk" },
  { event: "clerk/user.created" },
  async (event)=>{
    const{ id,first_name,last_name,email_addresses,image_url,username}=event.data;
    username=username || email_addresses[0].email_address.split('@')[0];

      const user= await User.findOne({username});
      if(user){
        username=username+Math.floor(Math.random()*1000);
      }

    const newUser=new User({
      _id:id,
      email:email_addresses[0].email_address,
      full_name:`${first_name} ${last_name}`,
      username:username,
      profile_picture:image_url
    });

    await newUser.save();
  }
);


// Ingestion Function to update in databse
const UpdateUserData=inngest.createFunction(
  { id: "Update User Data From Clerk" },
  { event: "clerk/user.updated" },
  async (event)=>{
    const{ id,first_name,last_name,email_addresses,image_url}=event.data;
    
    const updatedUserData={
        email:email_addresses[0].email_address,
        full_name:`${first_name} ${last_name}`,
        profile_picture:image_url
    }
    await User.findByIdAndUpdate(id,updatedUserData);
 
  }
);

// Ingestion Function to delete in databse
const DeleteUserData=inngest.createFunction(
  { id: "Delete User Data From Clerk" },
  { event: "clerk/user.deleted" },
  async (event)=>{
    const{ id}=event.data;
    await User.findByIdAndDelete(id);
  }
);

export const functions = [
    SaveUserData,
    UpdateUserData,
    DeleteUserData
];