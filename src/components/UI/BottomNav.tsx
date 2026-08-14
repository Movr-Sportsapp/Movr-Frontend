import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Search, UserRound, MessageCircleMore } from 'lucide-react';
import Insta from '../../assets/img/instagram-lime.png';
import Facebook from '../../assets/img/facebook.png';
import Whatsapp from '../../assets/img/whatsapp.png';
import Youtube from '../../assets/img/youtube.png';

import { useAuth } from "../../context/AuthContext";

const navItems = [
    {icon: Home, path: '/'},
    {icon: PlusCircle, path: '/createevent'},
    // CTA middle Button handled seperately down below
    {icon: UserRound, path:'/me'}, // Profile Page needs to be finished, backend logic aswell
    {icon: MessageCircleMore, path:''}, // Non-existing at the moment. Needs to be added when Profile Page is ready (if we find the time)
];

export default function BottomNav() {
    const location = useLocation();
    const isActive = (path:string) => location.pathname === path;
    const {user, loading } = useAuth();
   
    if (loading) return null;

    return (
       <>
        { user ? (
        <nav className="fixed bottom-4 left-4 right-4 flex justify-center z-50">
            <div className="relative flex items-center justify-between w-full max-w-sm px-6 py-3 rounded-full bg-black/60 backdrop-blur-lg shadow-lg">
            {navItems.slice(0, 2).map(({ icon: Icon, path }) => (
            <Link key={path} to={path}>
                <Icon className={isActive(path) ? "text-lime-400" : "text-white"} />
            </Link>
                ))}
            {/* CTA BUTTON : Search Activities - floats above bar */}
            <Link to="/events" 
                  className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-full bg-lime-400 flex items-center justify-center shadow-md">
                <Search className="text-white w-6 h-6" />
            </Link>
                {/* spacer so CTA doesnt overlap icons on the right side of it */}
                <div className="w-10" />
            {navItems.slice(2).map(({ icon: Icon, path }) => (
            <Link key={path || 'messages'} to={path}>
                <Icon className={isActive(path) ? "text-lime-400" : "text-white"} />
            </Link>
            ))}
            </div>
        </nav>
    ) : (
        <footer className="bg-black border-t border-white/10">
                    <div className="w-screen mt-3">
                        <div className="flex items-start justify-evenly sm:justify-between md:auto px-2 sm:px-4 md:px-auto py-3">
                            <div className="text-black font-bold leading-3 border-lime-400 border-x-4 bg-lime-400 p-3 rounded-lg">
                                <p>MOVR</p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 md:gap-15">
                                <div>
                                    <h2 className="mb-2 text-xs sm:text-sm font-semibold text-white uppercase">About</h2>
                                    <ul className="text-white/60 text-xs sm:text-sm">
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">Our Story</a></li>
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">Careers</a></li>
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">Our Team</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 className="mb-2 text-xs sm:text-sm font-semibold text-white uppercase">Support</h2>
                                    <ul className="text-white/60 text-xs sm:text-sm">
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">FAQ</a></li>
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">Contact</a></li>
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">Help Center</a></li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 className="mb-2 text-xs sm:text-sm font-semibold text-white uppercase">Find Us</h2>
                                    <ul className="text-white/60 text-xs sm:text-sm">
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">Events</a></li>
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">Location</a></li>
                                        <li className="mb-1"><a className="hover:text-lime-400 hover:underline" href="#">Newsletter</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row justify-evenly md:justify-end md:px-10 md:gap-18">
                            <img src={Insta} className="w-5" />
                            <img src={Whatsapp} className="w-5" />
                            <img src={Facebook} className="w-5" />
                            <img src={Youtube} className="w-5" />
                        </div>
                        <hr className="mt-4 border-white/10 md:mx-auto lg:mt-6" />
                        <span className="block text-xs text-center text-white/50 p-3">© 2026 MOVR. All Rights Reserved.</span>
                    </div>
                </footer>
            )}
        </>
    );
}
