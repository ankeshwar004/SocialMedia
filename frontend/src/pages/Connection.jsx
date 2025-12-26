import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User2, UserCheck2, UserPlus2, UserRoundCheck } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { fetchConnections } from "../features/connections/connectionSlice";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../api/axios";


export default function Connection() {

	const navigate=useNavigate();
	const { getToken }=useAuth();
	const dispatch=useDispatch();
	const [currTab,setCurrTab]=React.useState("Followers");
	const {connections,pendingConnections,followers,followings}=useSelector((state)=>state.connections);

	const dataArray=[
		{label:"Followers",value:followers,icon:User2},
		{label:"Followings",value:followings,icon:UserCheck2},
		{label:"Pending",value:pendingConnection,icon:UserRoundCheck},
		{label:"Connections",value:connection,icon:UserPlus2}
	];

	const handleUnfollow= async(userId)=>{
		const token= await getToken();
		try{
			const {data}=await api.post('/api/user/unfollow',{id:userId},{
				headers:{Authorization:` Bearer ${token}`}
			})	
			if(data.success){
				toast.success(data.message);
				dispatch(fetchConnections({token}));
			}else{
				toast.error(data.message);
			}
		}catch(error){
			toast.error(error.message);
		}
	}
	const acceptConnection= async(userId)=>{
		const token= await getToken();
		try{
			const {data}=await api.post('/api/user/accept',{id:userId},{
				headers:{Authorization:` Bearer ${token}`}
			})	
			if(data.success){
				toast.success(data.message);
				dispatch(fetchConnections({token}));
			}else{
				toast.error(data.message);
			}
		}catch(error){
			toast.error(error.message);
		}
	}

	const buttonAction=(tab,user)=>{
		switch(tab){
			case "Followers":
				return <button onClick={(e)=>{ e.stopPropagation(); navigate(`/profile/${user._id}`)}} 
				className="text-sm ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">View Profile</button>;
			case "Followings":
				return <button  onClick={()=> handleUnfollow(user._id)}
				 className="text-sm ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Unfollow</button>;
			case "Pending":
				return <button  onClick={()=> acceptConnection(user._id)}
				 className="text-sm ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Accept</button>;
			case "Connections":
				return <button onClick={(e)=>{ e.stopPropagation(); navigate(`/messages/${user._id}`)}}
				 className="text-sm ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Message</button>;
			default:
				return null;
		}
	};

	useEffect(()=>{
		getToken().then((token)=>{
			dispatch(fetchConnections({token}));
		})
	},[])

	return (
		<div className="m-h-screen bg-slate-50">
			<div className="max-w-6xl mx-auto p-6">

				{/* Title */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-900 mb-2">Connections</h1>
					<p className="text-gray-600">Manage your connections</p>
				</div>

				{/* Counts */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
					{dataArray.map((item, index) => (
						<div key={index} className="bg-white p-4 rounded-lg shadow">
							<div className="flex items-center mb-2">
								<item.icon className="h-6 w-6 text-gray-500 mr-2" />
								<span className="font-semibold">{item.label}</span>
							</div>
							<span className="text-2xl font-bold">{item.value.length}</span>
						</div>
					))}
				</div>

				{/* Tabs */}
				<div className="mb-6 border-b border-gray-200">
					<nav className="-mb-px flex space-x-8" aria-label="Tabs">
						{dataArray.map((item, index) => (
							<a
								key={index}
								href="#"
								className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
									currTab === item.label
										? "border-blue-600 text-blue-600"
										: "border-transparent text-gray-500 hover:text-gray-700"
								}`}
								onClick={() => setCurrTab(item.label)}
							>
								{item.label}
							</a>
						))}
					</nav>
				</div>

				{/* Connections */}
					<ul className="space-y-4">
						{dataArray.find(tab => tab.label === currTab).value.map((user, index) => (
							<li onClick={()=>{navigate(`/profile/${user._id}`)}} key={user._id} className="p-6 hover:bg-gray-100 border border-gray-200 rounded-lg transition cursor-pointer">
								<div className="flex items-center">
									<img src={user.profile_picture} alt={user.full_name} className="size-12 rounded-full mr-4" />
									<div>
										<h3 className="text-m font-semibold">{user.full_name}</h3>
										<p className="text-m text-gray-500">{user.bio.length<100?user.bio:user.bio.slice(0,100)+"...."}</p>
									</div>
									<div>
										{
											buttonAction(currTab,user)
										}
									</div>
								</div>
							</li>
						))}
					</ul>

			</div>

		</div>
	);
}

