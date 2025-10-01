import React ,{useState, useRef, useEffect} from "react";
import { useParams } from "react-router-dom";
import { dummyMessagesData, dummyUserData } from "../assets/assets";
import { ImageIcon, SendHorizonal } from "lucide-react";

export default function ChatBox() {

	const messages = dummyMessagesData;
	const [text,setText]=useState("");
	const [image,setImage]=useState(null);
	const [user,setUser]=useState(dummyUserData);
	const messageEndRef = useRef(null);

	const sendMessage=()=>{
		// Handle send message logic here
	}

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return user &&  (
		<div className="h-screen flex flex-col">
			<div className="flex items-center gap-2 p-2 md:px-10 xl:pl-42
			bg-gradient-to-r from-purple-600 to-blue-500 text-white border-gray-300">
				<img src={user.profile_picture} alt="Profile" className="size-8 rounded-full"/>
				<div>
					<p className="font-medium">{user.full_name}</p>
					<p className="text-sm text-gray-900 -mt-1.5">{user.username}</p>
				</div>
			</div>
				<div className="p-5 md:px-10 h-full overflow-y-scroll">
					<div className="space-y-4 max-w-4xl mx-auto">
						{
							messages.toSorted((a,b)=>new Date(a.timestamp)-new Date(b.timestamp)).map((msg,index)=>(
								<div key={index} className={`flex flex-col ${msg.to_user_id===user._id ? 'items-start' : 'items-end'}`}>
									<div className={`p-2 text-sm rounded-lg max-w-sm bg-white text-slate-700 ${msg.to_user_id===user._id ? 'rounded-bl-none' : 'rounded-br-none'}`}>
										{
											msg.message_type==='image' && (
												<img src={msg.media_url} alt="" className="w-full max-w-sm
												 rounded-lg mb-1"/>
											)
										}
										<p>{msg.text}</p>
									</div>
								</div>
							))
						}
						<div ref={messageEndRef} />
					</div>
				</div>
				<div className="px-4">
					<div className="flex items-center gap-3 p-1.5 pl-5  bg-white w-full max-w-xl mx-auto border border-gray-300 rounded-full mb-5">
						<input type="text" className="flex-1 outline-none text-slate-700" placeholder="Write a message..." 
						onKeyDown={e=>e.key==='Enter' && sendMessage()} onChange={e=>setText(e.target.value)} value={text}/>
						<label htmlFor="image">
							{
								image? <img src={URL.createObjectURL(image)} onClick={(e) => {setImage(null);e.preventDefault()}}
								 alt="image preview" className="w-8 h-8 rounded-full"/> :
								<ImageIcon className="size-7 text-gray-500 cursor-pointer"/>
							}
							<input type="file" id="image" accept="image/*" hidden onChange={e=>setImage(e.target.files[0])} />
						</label>
						<button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-full
						 hover:bg-blue-600 transition cursor-pointer">
							<SendHorizonal size={19 }/>
						</button>


					</div>

				</div>

		</div>
	);
}

