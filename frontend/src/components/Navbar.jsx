import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">NewsPortal</Link>
        <div className="nav-links">
          {user ? (
            <>
              <span className="nav-user">Welcome, {user.name}</span>
              <Link to="/create-article" className="nav-link">New Article</Link>
              <button onClick={handleLogout} className="btn-secondary nav-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary nav-btn">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
