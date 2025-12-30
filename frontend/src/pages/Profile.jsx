import React ,{useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import moment from "moment";
import ProfileModal from "../components/ProfileModal";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";

export default function Profile() {

	const currUser=useSelector((state)=>state.user.value);
	const { getToken }=useAuth();
	const { profileId } = useParams();
	const [user,setUser]=useState(null);
	const [posts,setPosts]=useState([]);
	const [activeTab,setActiveTab]=useState('posts');
	const [showEdit,setShowEdit]=useState(false);

	const fetchUser=async(profileId)=>{
		const token=await getToken();
		try{
			const {data}=await api.post('/api/user/profiles',{profileId},{
				headers:{Authorization:`Bearer ${token}`}
			})
			if(data.success){
				setUser(data.profile);
				setPosts(data.posts);
			}else{
				toast.error(data.message);
			}
		}catch(error){
			toast.error(error.message);
		}
	}

	useEffect(()=>{
		profileId?fetchUser(profileId):fetchUser(currUser._id);
		
	},[profileId,currUser]);


	const displayedUser = profileId ? user : (currUser || user);

	return displayedUser ? (
		<div className="relative h-full overflow-y-scroll bg-gray p-6">
			<div className="max-w-3xl mx-auto">
				{/* Profile Card */}
				<div className="bg-white  rounded-md overflow-hidden">
					{/* Cover Photo */}
					<div className=" h-40 md:h-56 bg-gradient-to-r from-purple-500 to-indigo-600">
						{displayedUser.cover_photo && <img src={displayedUser.cover_photo} alt="profile" className="size-full object-cover" />}
					</div>
					{/* Profile Info */}
					<UserProfileInfo user={displayedUser} posts={posts} profileId={profileId} setShowEdit={setShowEdit} />  
				</div>
				{/* Tabs */}
				<div className="mt-6 ">
					<div className="flex border-b border-gray-200 bg-white rounded-md">
						<button onClick={()=>setActiveTab('posts')} className={`flex-1 text-center px-4 py-3 ${activeTab==='posts'?'border-b-2 border-indigo-600 text-indigo-600 font-semibold':'text-gray-600 hover:bg-gray-50'}`}>Posts</button>
						<button onClick={()=>setActiveTab('media')} className={`flex-1 text-center px-4 py-3 ${activeTab==='media'?'border-b-2 border-indigo-600 text-indigo-600 font-semibold':'text-gray-600 hover:bg-gray-50'}`}>Media</button>
						<button onClick={()=>setActiveTab('likes')} className={`flex-1 text-center px-4 py-3 ${activeTab==='likes'?'border-b-2 border-indigo-600 text-indigo-600 font-semibold':'text-gray-600 hover:bg-gray-50'}`}>Likes</button>
					</div>
					{/* Posts */}
					{activeTab==='posts' && (
						<div className="mt-6 flex flex-col items-center gap-6">
							{posts.map(post=>(<PostCard key={post.id} post={post}/>))}
						</div>
					)}
					{/* Media */}
					{activeTab==='media' && (
						<div className="mt-6 grid grid-cols-1 sm:grid-cols-2  gap-3">
							{posts.filter((post)=>post.image_urls.length>0).map((post)=>(
								post.image_urls.map((url,index)=>(
									<Link key={post._id} to={url} className="relative group block">
										<img src={url} alt={`Media ${index}`} className="w-full aspect-video object-cover rounded" />
										<p className="absolute bottom-0 right-0 text-xs text-gray-600 p-1 bg-black-500
										 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition">Posted {moment(post.createdAt).fromNow()}</p>
									</Link>
								))
							))}
						</div>
					)}
					{/* Likes placeholder (if needed) */}
					{activeTab==='likes' && (
						<div className="mt-6 text-center text-gray-500">No liked posts yet.</div>
					)}
				</div>
				</div> 
        {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
		</div>
 	) : <Loading/>;
}

