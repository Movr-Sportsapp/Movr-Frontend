import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import DefaultAvatar from "../../assets/img/default_userAvatar.png";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const decoyLinks = [
    { label: "Home", to: "/" },
    { label: "My Profile", to: "/me" }, // <-- fill in real path once profile page exists
    { label: "Browse Activities", to: "/events" },
    { label: "Messages", to: "" }, // <-- decoy, no page yet
    { label: "About Us", to: "" }, // <-- decoy, no page yet
    { label: "Contact MOVR", to: "" }, // <-- decoy, no page yet
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 border-b border-divider bg-bg/90 backdrop-blur-md">
      <Link
        to="/"
        className="font-display font-black text-2xl tracking-widest uppercase text-white hover:text-lime"
      >
        MOVR
      </Link>
      {!loading && !user && (
        <div className="flex items-center gap-3">
          <NavLink
            to="/signup"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-lime-400 text-black hover:bg-lime-300 transition-colors duration-200"
          >
            Join Movr
          </NavLink>
          <NavLink
            to="/login"
            className="px-4 py-2 rounded-lg text-sm font-medium border border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black transition-colors duration-200"
          >
            Login
          </NavLink>
        </div>
      )}

      {!loading && user && (
        <div className="flex items-center gap-4">
          <NavLink
            to="/createevent"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-lime-400 text-black hover:bg-lime-300 transition-colors duration-200"
          >
            Post activity
          </NavLink>

          <span className="hidden sm:inline text-white/70 text-sm">
            {`Hi, ${user.username}`}
          </span>

          <Link to="/me"> {/* <-- fill in real profile path */}
            <img
              src={user.profileImage || DefaultAvatar}
              alt={user.username}
              onError={(e) => {
                e.currentTarget.src = DefaultAvatar;
              }}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-lime-400/50"
            />
          </Link>

          {/* Burger - mobile only */}
          <button
            className="sm:hidden text-white"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      )}

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-16 right-4 w-56 rounded-xl bg-black/90 backdrop-blur-md border border-white/10 shadow-lg flex flex-col p-2 sm:hidden">
          {decoyLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-white hover:bg-lime-400 hover:text-black transition-colors duration-200"
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="mt-1 px-3 py-2 rounded-lg text-sm text-left text-red-400 hover:bg-red-400 hover:text-black transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
