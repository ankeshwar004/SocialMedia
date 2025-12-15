import React from "react";
import { Routes,Route} from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connection from "./pages/Connection";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import { useAuth, useUser} from '@clerk/clerk-react';
import Layout from "./pages/Layout";
import {Toaster} from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { isLoaded, isSignedIn, user } = useUser();
  const {getToken} = useAuth();

  // useEffect(()=>{
  //   if(user){
  //     getToken({ template: "backend" }).then((token)=>{console.log(token)});
  //   }
  // },[user]);


   useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const token = await getToken({ template: "backend" });
          
          // Call your backend API with Bearer token
          const res = await fetch("http://localhost:5000/api/user/data", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          console.log("User data from backend:", data);
          console.log(token);
        } catch (err) {
          console.error("Error fetching backend data:", err);
        }
      };

      fetchUserData();
    }
  }, [user, getToken]);

  
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
