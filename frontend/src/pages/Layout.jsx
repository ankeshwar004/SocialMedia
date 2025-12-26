import React,{useState, useEffect} from "react";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import Loading from "../components/Loading";
import { Menu,X } from "lucide-react";
import { useSelector } from "react-redux";


function Layout(){
    const user=useSelector((state)=>state.user.value);
    const [sidebarOpen,setSidebarOpen]=useState(false);
    // #region agent log
    useEffect(()=>{
        fetch('http://127.0.0.1:7242/ingest/d8e79a4f-125f-4e88-ab68-736336c4bfa5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Layout.jsx:12',message:'Layout render - user state',data:{hasUser:!!user,userType:typeof user,userKeys:user?Object.keys(user):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    },[user]);
    // #endregion
    return user ? (
                <div className="w-full h-full relative">
                        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                        {/* Backdrop for small screens when sidebar open */}
                        {sidebarOpen && (
                            <div
                                onClick={() => setSidebarOpen(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-[1px] sm:hidden z-20"
                            />
                        )}
                        <div className="bg-slate-50 min-h-screen sm:ml-60 xl:ml-72 transition-[margin] duration-300">
                            <Outlet />
                        </div>
            {
                sidebarOpen?
                <X className="absolute top-3 right-3 p-2 z-50 bg-white rounded-md shadow 
                 w-10 h-10 text-gray-700 sm:hidden" onClick={()=>setSidebarOpen(false)}/>
                 :<Menu className="absolute top-3 right-3 p-2 z-50 bg-white rounded-md shadow 
                 w-10 h-10 text-gray-700 sm:hidden" onClick={()=>setSidebarOpen(true)}/>
            }
        </div>
        
    ):(
        <Loading />
    )
}
export default Layout;