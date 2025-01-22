import { Link } from 'react-router-dom'
import './NavBar.css'

const NavBar = ({ logOut, user }) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/dashboard">My Items</Link>
            </li>
            <li>
              <Link to="/new-item">New Item</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/" onClick={logOut} className="logout-link">
                Log out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/auth/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/auth/signup">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
      {user && (
        <div className="user-info">
          {user.avatar ? (
            <img src={user.avatar} alt="User Avatar" className="user-avatar" />
          ) : (
            <span className="avatar-placeholder">👤</span>
          )}
          <p className="welcome-message">Welcome, {user.username}</p>
        </div>
      )}
    </nav>
  )
}

export default NavBar
