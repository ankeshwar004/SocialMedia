import React ,{useState} from "react";
import { Image, X } from "lucide-react";
import tost, { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {useAuth} from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import api from "../api/axios";


export default function CreatePost() {

	const navigate=useNavigate();
	const [content,setContent]=useState("");
	const [images,setImages]=useState([]);
	const [loading,setLoading]=useState(false);

	const user=useSelector((state)=>state.user.value);
	const {getToken}=useAuth();

	const handleSubmit=async()=>{
		if(!images.length && !content.trim()){
			return toast.error("Post cannot be empty");
		}
		setLoading(true);
		const postType= images.length && content ? "text_with_image": images.length ? "image" : "text";

		try{
			const formData=new FormData();
			formData.append('content',content); 
			formData.append('post_type',postType); 
			images.forEach((img)=>{
				formData.append('images',img);
			}); 
			const {data}=await api.post('/api/post/add',formData,{
				headers:{
					'Authorization': `Bearer ${await getToken({template:"backend"})}`
				}
			});
			if(data.success){
				navigate('/');
			}else{
				toast.error(data.message);
			}
		}catch(error){
			console.log(error);
			toast.error("Error creating post");
		}
	}

	return (
		<div className="m-h-screen bg-slate-50">
			<div className="max-w-6xl mx-auto p-6">

				{/* Title */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-900 mb-2">Create Post</h1>
					<p className="text-gray-600">Share your thoughts and ideas</p>
				</div>
				{/* Post Form */}
				<div className="bg-white p-6 rounded-lg shadow-md">
					{/* User Info */}
					<div className="flex items-center mb-4">
						<img src={user.profile_picture} alt="Profile" className="w-12 h-12 rounded-full mr-4"/>
						<div>
							<p className="font-semibold text-lg">{user.full_name}</p>
							<p className="text-gray-500">@{user.username}</p>
						</div>
					</div>
					{/* Textarea */}
					<textarea value={content} onChange={(e)=>setContent(e.target.value)} rows="4" placeholder="What's on your mind?"
						className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 resize-none"/>
					{/* Image Upload */}
					{
						images.length > 0 && (
							<div className="mb-4 flex flex-wrap gap-2 group">
								{images.map((img,index)=>(
									<div key={index} className="relative">
										<img src={URL.createObjectURL(img)} alt={`Upload ${index}`} className="h-32 object-cover rounded-md"/>
										<div onClick={()=>{
											const newImages=images.filter((_,i)=>i!==index);
											setImages(newImages);
										}} className="absolute hidden top-0 bottom-0 right-0 left-0 bg-black/40
										group-hover:flex items-center justify-center rounded cursor-pointer ">
											<X  className="size-6 text-white" />
										</div>
									</div>
								))}
							</div>
						)
					}
					<div className="flex items-center justify-between">
						<label htmlFor="images" className="cursor-pointer text-indigo-600 hover:text-indigo-800 font-semibold">
                         <Image className="size-7" />
						</label>
						<input type="file" id="images" accept="image/*" multiple className="hidden"
								onChange={(e)=>{
									setImages([...images,...e.target.files]);
								}}/>
						<button disabled={loading } onClick={()=>{tost.promise(handleSubmit(),{
							loading:"Posting...",
							success:"Post created!",
							error:"Error creating post"
						})}} className={`px-10 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400`}>
							Post
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

