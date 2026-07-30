import React from 'react';
import {
     LogOut,
     LayoutDashboard,
     Users,
     Radar,
     ClipboardList,
     Package
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/authServices';
import './Navbar.css';


const Navbar = () => {
     const navigate = useNavigate();
     const location = useLocation();

     const isLoggedIn = !!localStorage.getItem('token');

     const handleLogout = () => {
          logout();
          navigate('/');
     };

     if (!isLoggedIn || location.pathname === '/') return null;

     const isActive = (path) => location.pathname.startsWith(path);

     return (
          <nav className="navbar">
               <div className="navbar-container">

                    <div
                         className="navbar-logo"
                         onClick={() => navigate('/clientDashboard')}
                    >
                         <LayoutDashboard size={24} />
                         <span>KALPAVRUKSH ENTERPRISE</span>
                    </div>

                    <div className="navbar-links">

                         <button
                              className={`nav-link ${isActive('/clientDashboard') ? 'active' : ''}`}
                              onClick={() => navigate('/clientDashboard')}
                         >
                              <Users size={16} />
                              Clients
                         </button>

                         <button
                              className={`nav-link ${isActive('/leadDashboard') ? 'active' : ''}`}
                              onClick={() => navigate('/leadDashboard')}
                         >
                              <Radar size={16} />
                              Discover Leads
                         </button>

                         <button
                              className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
                              onClick={() => navigate('/tasks')}
                         >
                              <ClipboardList size={16} />
                              Tasks
                         </button>

                    </div>
                    <button
    className={`nav-link ${isActive('/inventory') ? 'active' : ''}`}
    onClick={() => navigate('/inventory')}
>
    <Package size={16}/>
    Inventory
</button>

                    <div className="navbar-actions">

                         <button
                              onClick={handleLogout}
                              className="logout-btn"
                         >
                              <LogOut size={18} />
                              <span>Log Out</span>
                         </button>
                         

                    </div>

               </div>
          </nav>
     );
};

export default Navbar;
