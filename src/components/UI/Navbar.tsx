import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DefaultAvatar from '../../assets/img/default_userAvatar.png';

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

    return (
       <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6 border-b border-divider bg-bg/90 backdrop-blur-md" >
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          MOVR
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {user && (
            <li>
              <NavLink to="/createevent">Post Event</NavLink>
            </li>
          )}

          {loading ? null : user ? (
            <>
              
                <span className="opacity-70 cursor-pointer">
                  { `Hi, ${user.username}` }
                </span>
                <li className="">
                <img
              src={user.profileImage || DefaultAvatar}
              alt={user.username}
              className="w-7 h-7 rounded-full object-cover"
            />  
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/signup">Join Movr</NavLink>
              </li>
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>   
  );
};

export default Navbar;
