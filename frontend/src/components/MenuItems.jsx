import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets";

function MenuItems({setSidebarOpen}) {
    return (
        <div className="px-6 text-gray-700 space-y-1 font-medium">
           {
            menuItemsData.map(({to,label,Icon})=>(
                <NavLink to={to} key={label} onClick={() => setSidebarOpen(false)} className={({isActive})=>`flex items-center gap-4 px-3 py-2 rounded-xl
                  ${isActive ? 'text-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}>
                    <Icon className="w-5 h-5"/>
                    <span className="text-sm">{label}</span>
                </NavLink>
            ))
           }
        </div>
    );
}
export default MenuItems;