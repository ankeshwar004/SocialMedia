import React from "react";
import { Eye, MessageCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


export default function Messages() {

	const {connections}=useSelector((state)=>state.connections);
	const navigate=useNavigate();

	return (
		<div className="min-h-screen relative bg-slate-50">
			<div className="max-w-6xl mx-auto p-6">
				{/* Title */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-slate-900 mb-2">Message</h1>
					<p className="text-gray-600">Talk with anyone</p>
				</div>
				{/* Chat List */}
				<div className="flex flex-col gap-3">
					{
						connections.map((user, index) => (
							<div className="max-w-xl flex flex-warp items-center gap-5
							 p-6 bg-white rounded-md shadow" key={user._id}>
								<img src={user.profile_picture} alt="profile" 
								className="size-12 rounded-full mx-auto" />
								<div className="flex-1">
									<p className="font-medium">{user.full_name}</p>
									<p className="text-slate-500 mb-3">@{user.username}</p>
									<p className="text-xs text-slate-600">{user.bio}</p>
								</div>

								<div className="flex flex-col gap-2 mt-4">
									<button onClick={() => navigate(`/messages/${user._id}`)} className='size-10 flex items-center justify-center text-sm
										rounded bg-slate-100 hover:bg-slate-200 text-slate-800
										active: scale-95 transition cursor-pointer gap-1'>
										<MessageCircleIcon className="size-4"/>
									</button>
									<button onClick={() => navigate(`/profile/${user._id}`)} className='size-10 flex items-center justify-center text-sm
										rounded bg-slate-100 hover:bg-slate-200 text-slate-800
										active: scale-95 transition cursor-pointer gap-1'>
										<Eye className="size-4"/> 
									</button>

								</div>
							</div>	
						))

					}

				</div>

			</div>

		</div>
	);
}

