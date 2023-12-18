import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="py-2 px-4 bg-royal-purple">
      <div className="flex justify-between items-center">
        <ul className="flex gap-4 justify-center text-white text-lg">
          {!user && (
            <li className="hover:text-mandarin">
              <Link to="/login">Login</Link>
            </li>
          )}
          {user && (
            <li className="hover:text-mandarin">
              <button onClick={logout}>Logout</button>
            </li>
          )}
        </ul>
        {user && (
          <div className="rounded-full overflow-hidden w-10 h-10">
            <img src={user?.photoURL} alt="profile" />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
