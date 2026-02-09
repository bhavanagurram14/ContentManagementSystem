import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <FaEdit /> Blog CMS
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/categories" className="nav-link">Categories</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-posts" className="nav-link">My Posts</Link>
              <Link to="/create-post" className="btn btn-primary btn-sm">
                <FaEdit /> New Post
              </Link>
              <div className="user-menu">
                <span className="user-name"><FaUser /> {user?.username}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                <FaSignInAlt /> Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <FaUserPlus /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
