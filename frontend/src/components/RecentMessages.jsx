import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../api/axios";


function RecentMessages() {

    const [messages, setMessages] = useState([]);
    const [unSeenCount, setUnseenCount] = useState(0);
    const { user } = useUser();
    const { getToken } = useAuth();

    const fetchRecentMessages = async () => {
        try {
            const token = await getToken();
            const { data } = await api.get('/api/user/recent-messages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log("Recent messages data:", data);
            if (data && data.success) {
                const messagesArray = data.message || [];
                const groupedMessages = messagesArray.reduce((acc, msg) => {
                    const senderId = msg?.from_user_id?._id;
                    if (!senderId) return acc;
                    if (!acc[senderId] || new Date(msg.createdAt) > new Date(acc[senderId].createdAt)) {
                        acc[senderId] = msg;
                    }
                    return acc;
                }, {});
                console.log("Grouped messages:", groupedMessages);

                const sortMessages = Object.values(groupedMessages).sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt));
                setMessages(sortMessages);
            } else {
                setMessages([]);
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        if (user) {
            fetchRecentMessages();
            const intervalId = setInterval(fetchRecentMessages, 60000);
            return () => { clearInterval(intervalId) };
        }
    }, [user]);

    return (
        <div className="bg-white text-xs p-4 rounded-md max-w-xs p-4 mt-4 min-h-20 shadow
         text-slate-800">
            <h3 className="font-semibold mb-8 text-slate-800">Recent Messages</h3>
            <div className="flex flex-col max-h-60 overflow-y-scroll no-scrollbar gap-4">
                {
                    messages.map((msg, index) => (
                        <Link to={`/messages/${msg.from_user_id._id}`} key={index} className="flex items-start gap-2 py-2
                         hover:bg-slate-100">
                            <img src={msg.from_user_id.profile_picture} alt="profile" className="size-8
                            rounded-full"/>
                            <div className="w-full">
                                <div className="flex justify-between  mb-1">
                                    <p className="font-semibold font-medium">
                                        {msg.from_user_id.full_name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {moment(msg.createdAt).fromNow()}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="text-gray-600 ">
                                        {msg.text ? msg.text : msg.message_type }
                                    </p>
                                    {
                                        !msg.seen && (
                                            <p className="bg-indigo-600 text-white 
                                            text-[10px] size-4 rounded-full flex items-center
                                             justify-center">
                                                1
                                            </p>
                                        )
                                    }
                                </div>
                            </div>

                        </Link>
                    ))
                }

            </div>
        </div>
    )
}
export default RecentMessages;