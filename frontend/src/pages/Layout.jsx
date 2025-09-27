import React,{useState} from "react";
import Sidebar from "../components/sidebar";
import { Outlet } from "react-router-dom";
import { dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import { Menu,X } from "lucide-react";

function Layout(){
    const user=dummyUserData;
    const [sidebarOpen,setSidebarOpen]=useState(false);
    return user ? (
        <div className="w-full h-full flex">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 bg-slate-50 min-h-screen">
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