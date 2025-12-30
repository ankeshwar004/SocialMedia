import React,{useState, useEffect} from "react";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import Loading from "../components/Loading";
import { Menu,X } from "lucide-react";
import { useSelector } from "react-redux";


function Layout(){
    const user=useSelector((state)=>state.user.value);
    const [sidebarOpen,setSidebarOpen]=useState(false);
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