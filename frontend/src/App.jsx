import React, { use, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connection from "./pages/Connection";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import { useAuth, useUser } from '@clerk/clerk-react';
import Layout from "./pages/Layout";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import { fetchConnections } from "./features/connections/connectionSlice";
import { addMessages, updateMessageStatus } from "./features/messages/messagesSlice";


function App() {
  const {  user } = useUser();
  const { getToken } = useAuth();
  const {pathname}= useLocation();
  const pathnameRef=useRef(pathname);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken({ template: "backend" });
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    }
    fetchData();

  }, [user, getToken, dispatch]);

  useEffect(()=>{
    pathnameRef.current=pathname;
  },[pathname]);

  useEffect(()=>{
    if(user){
      const eventSource=new EventSource(`${import.meta.env.VITE_BASEURL}/api/message/${user.id}`);
      eventSource.onmessage= async (event)=>{
      let messageData;
      try {
        messageData = JSON.parse(event.data);
      } catch {
        // Ignore non-JSON events like 'log' or keep-alive
        return;
      }
        if(messageData.type==="status"){
          dispatch(updateMessageStatus(messageData.updates));
        }else{
          const msg = messageData.type === 'message' ? messageData : messageData;
          if(pathnameRef.current===('/messages/'+msg.from_user_id._id)){
            dispatch(addMessages(msg));
          }else{
            // show notification
          }
        }
      }
      return ()=> {
          eventSource.close();  
      }
    }
  },[user,dispatch]);


  //  useEffect(() => {
  //   if (user) {
  //     const fetchUserData = async () => {
  //       try {
  //         const token = await getToken({ template: "backend" });

  //         // Call your backend API with Bearer token
  //         const res = await fetch("http://localhost:5000/api/user/data", {
  //           headers: { Authorization: `Bearer ${token}` },
  //         });

  //         const data = await res.json();
  //         console.log("User data from backend:", data);
  //         console.log(token);
  //       } catch (err) {
  //         console.error("Error fetching backend data:", err);
  //       }
  //     };

  //     fetchUserData();
  //   }
  // }, [user, getToken]);


  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connection />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
