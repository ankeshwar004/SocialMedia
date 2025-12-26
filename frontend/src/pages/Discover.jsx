import React, { useEffect } from "react";
import { useState } from "react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/user/userSlice";


export default function Discover() {

	const dispatch=useDispatch();
	const [input,setInput]=useState("");
	const [user,setUser]=useState([]);
	const [loading,setLoading]=useState(false);
	const {getToken}=useAuth();	

	const handleSearch= async (e)=>{
		if(e.key==="Enter"){
			try{
				setUser([])
				setLoading(true);
				const {data}= await api.post('/api/user/discover',{input},{
					headers:{Authorization:` Bearer ${await getToken()}`}
				});
				if(data.success){
					setUser(data.users);
				}else{
					toast.error(data.message);
				} 
				setLoading(false);
				setInput('');

			}catch(error){
				toast.error(error.message);
			}
			setLoading(false);
		}
	}

	useEffect(()=>{
		getToken().then(async(token)=>{
			dispatch(fetchUser(token));
		})
	})

	return (
		<div className="m-h-screen bg-slate-50">
			<div className="max-w-6xl mx-auto p-6">

				{/* Title */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-900 mb-2">Discover People</h1>
					<p className="text-gray-600">Manage your connections</p>
				</div>

				{/* Search */}
				<div className="mb-8">
					<input type="text" value={input} onChange={(e)=>setInput(e.target.value)}
						onKeyUp={handleSearch} placeholder="Search people by name or username"
						className="w-full p-3 border border-gray-300
						 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
				</div>

				{/* UserList */}
				<div className="space-y-2">
					{user.map((user) => (
						<UserCard user={user} key={user._id}/>
					))}
				</div>

				{
					loading && <Loading height="60vh"/>
				}

			</div>
		</div>
	);
}

