import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import './Navbar.css';


const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
      
        try {
          await signOut(auth); // Sign out from Firebase auth
          sessionStorage.removeItem("jwt_token"); // Remove token from sessionStorage
          alert("Logged out successfully."); // Alert user of successful logout
          navigate('/login'); // Redirect to login page
        } catch (error) {
          console.error("Logout Error:", error);
          alert("Logout failed. Please try again."); // Alert user of error
        } 
      };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-brand">Task Manager</Link>
                {user && (
                    <div className="navbar-links">
                        <Link to="/home" className="navbar-link">Home</Link>
                        <Link to="/feed" className="navbar-link">Feed</Link>
                    </div>
                )}
            </div>
            <div className="navbar-right">
                
                    <button onClick={handleLogout} className="logout-button">Logout</button>
               
            </div>
        </nav>
    );
};

export default Navbar;