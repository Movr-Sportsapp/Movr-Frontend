import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Search, UserRound, MessageCircleMore } from 'lucide-react';

import { useAuth } from "../../context/AuthContext";

const navItems = [
    {icon: Home, path: '/'},
    {icon: PlusCircle, path: '/post'},
    // CTA middle Button handled seperately down below
    {icon: UserRound, path:'/me'}, // Profile Page needs to be finished, backend logic aswell
    {icon: MessageCircleMore, path:''}, // Non-existing at the moment. Needs to be added when Profile Page is ready (if we find the time)
];

export default function BottomNav() {
    const location = useLocation();
    const isActive = (path:string) => location.pathname === path;
    const user = useAuth();
   
    return (
        <nav className="fixed bottom-4 left-4 right-4 flex justify-center z-50">
            <div className="relative flex items-center justify-between w-full max-w-sm px-6 py-3 rounded-full bg-black/60 backdrop-blur-lg shadow-lg">
            <Link to='/'>
                <Home className={isActive('/') ? "text-lime-400" : "text-white"} />
            </Link>
            <Link to="/post">
                <PlusCircle className={isActive('/post') ? "text-lime-400" : "text-white"} />
            </Link>
            {/* CTA BUTTON : Search Activities - floats above bar */}
            <Link to="/events" 
                  className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-lime-400 flex items-center justify-center shadow-md">
                <Search className="text-white w-6 h-6" />
            </Link>
                {/* spacer so CTA doesnt overlap icons on the right side of it */}
                <div className="w-10" />
            <Link to="/me">
                <UserRound className={isActive("/me") ? "text-lime-400" : "text-white"} />
            </Link>
            <Link to=""> {/* working route needs to be added once we have one */}
                <MessageCircleMore className={isActive("") ? "text-lime-400" : "text-white"} />
            </Link>
            </div>
        </nav>
    )
}
