import React from "react";
import { dummyUserData } from "../assets/assets";
import { LocationEdit, MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";

function UserCard({user}) {
    
    const currUser=dummyUserData;
    
    const handleFollow=()=>{
        // Logic to follow the user
    }

    const handleConnectionRequest=()=>{
        // Logic to send connection request
    }

    return (
        <div className="border border-gray-800 border-slate-400 p-4 rounded-lg shadow-md">
            <div className="flex items-center">
                <img src={user.profile_picture} alt={user.full_name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                    <h2 className="text-xl font-bold">{user.full_name}</h2>
                    <div className="flex gap-4">
                        <p className="flex gap-1 px-1 py-0.5 text-sm border-1 border-slate-400 rounded-md text-gray-600"><MapPin className="size-4" />{user.location}</p>
                        <p className="text-sm px-1 py-0.5 border-1 border-slate-400 rounded-md text-gray-600">{user.followers.length} follower</p>
                        <p className="text-sm px-1 py-0.5 border-1 border-slate-400 rounded-md text-gray-600">{user.following.length} following</p>

                    </div>
                    
                    <div className="mt-2 flex gap-1">
                        {/* Follow Button */}
                        <button onClick={handleFollow} disabled={currUser?.following.includes(user._id)} 
                            className="flex justify-center items-center gap-2 w-full bg-indigo-600 text-white px-4 py-2 
                            rounded-md hover:bg-indigo-700 transition cursor-pointer">
                            <UserPlus className="size-4" />
                            {currUser?.following.includes(user._id) ? 'Following' : 'Follow'}
                        </button>
                        <button onClick={handleConnectionRequest} className="cursor-pointer flex items-center justify-center w-16 border text-slate-500 group
                         rounded-md active:scale-95 transition">
                            {
                                currUser?.connections.includes(user._id)?
                                <MessageCircle className="size-5 group-hover:scale-110 transition-transform"/>:
                                <Plus className="size-5 group-hover:scale-110 transition-transform"/>
                            }
                        </button>
                      


                    </div>
                
                </div>
            </div>
        </div>
    );
}
export default UserCard;