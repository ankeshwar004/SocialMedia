import { CirclePlus, LogOut, Menu } from "lucide-react";
import { assets} from "../assets/assets";
import MenuItems from "./MenuItems";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserButton,useClerk} from '@clerk/clerk-react';
import { useSelector } from "react-redux";



function Sidebar({ sidebarOpen, setSidebarOpen }) {
    
    const navigate = useNavigate();
    const {signOut} = useClerk();
    const user=useSelector((state)=>state.user.value);


    return (
        <div
            className={`w-60 xl:w-72 fixed top-0 left-0 h-screen bg-white border-r border-gray-200
            flex flex-col justify-between items-center z-30
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0`}
        >
            {/* Scroll container for menu if content exceeds viewport */}
            <div className="w-full overflow-y-auto scrollbar-thin scrollbar-track-transparent">
                <img
                    onClick={() => navigate('/')}
                    src={assets.logo}
                    alt="Sidebar"
                    className="w-26 ml-7 my-2 cursor-pointer"
                />
                <hr className="border-gray-300 mb-8" />
                <MenuItems setSidebarOpen={setSidebarOpen} />

                <Link
                    to='/create-post'
                    className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 bg-indigo-600
                    rounded-lg hover:bg-indigo-700 text-white active:scale-95 transition-all duration-150"
                >
                    <CirclePlus />
                    Create Post
                </Link>
            </div>

            <div className="w-full border-t border-gray-200 p-4 px-6 flex items-center justify-between">
                <div className="flex gap-2 cursor-pointer">
                    <UserButton />
                    <div>
                        <h1 className="text-sm font-medium">{user.full_name}</h1>
                        <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                </div>
                <LogOut
                    onClick={() => signOut()}
                    className="w-4.5 text-gray-400 cursor-pointer hover:text-gray-700 transition"
                />
            </div>
        </div>
    );
}
export default Sidebar;
