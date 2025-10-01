import { Calendar, MapPin, Verified } from "lucide-react";
import React from "react";

function UserProfileInfo({ user, posts,profileId,setShowEdit }) {
    return (
        <div className="relative py-4 px-6 md:px-8 bg-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full">
                    <img src={user.profile_picture} alt="profile" className="z-2  absolute rounded-full" />

                </div>

                <div className="w-full pt-16 md:pt-0 md:pl-36">
                    <div className="flex flex-col md:flex-row items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                                 <Verified className="text-blue-500 size-6"/>
                            </div>
                            <p className="text-sm text-gray-600">
                                {user.username?`@${user.username}`:"Add username"}
                            </p>
                        </div>
                         {/* If user on his profile then edit button show */}
                         {!profileId && <button onClick={()=>setShowEdit(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 cursor-pointer">Edit Profile</button>}

                    </div>
                    <p className="mt-4 text-sm max-w-md text-gray-800">{user.bio?user.bio:""}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-500 mt-4">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="size-4 "/>{user.location?user.location:"Add location"}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="size-4 "/> Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </span>
                    </div>

                    <div  className="flex items-center gap-6 mt-4  border-t border-gray-200 pt-4">
                        <div>
                            <span className="font-bold text-gray-900 sm:text-xl">{posts.length}</span>
                            <span className="text-xs sm:text-sm ml-1.5 text-gray-500"> Posts</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 sm:text-xl">{user.followers.length}</span>
                            <span className="text-xs sm:text-sm ml-1.5 text-gray-500"> Followers</span>
                        </div>
                        <div>
                            <span className="font-bold text-gray-900 sm:text-xl">{user.following.length}</span>
                            <span className="text-xs sm:text-sm ml-1.5 text-gray-500"> Following </span>
                        </div>

                    </div>
                     
                </div>

            </div>
 
        </div>
    )
}
export default UserProfileInfo;