// frontend/src/components/common/Navbar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import { useSettings } from '../../contexts/SettingsContext';
import { UserCog } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const { siteSettings } = useSettings();

  const navLinkClasses = ({ isActive }) =>
    `relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-sky-600 dark:text-sky-400 font-semibold'
        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
    }`;
    
  const mobileNavLinkClasses = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? 'bg-sky-500 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
    }`;

  const handleMobileLinkClick = () => setIsOpen(false);

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            {/* --- THIS IS THE UPDATED BRAND LINK --- */}
            <NavLink 
              to="/" 
              className="text-gray-800 dark:text-white font-bold text-xl hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
            >
              {siteSettings.ownerName || 'Harisharan'}
              {isAdmin && <span className="text-sm font-normal text-sky-500 ml-2">(Admin)</span>}
            </NavLink>
          </div>

          <div className="hidden md:flex md:items-center">
            <div className="flex items-baseline space-x-1">
              <NavLink to="/" className={navLinkClasses}>Home</NavLink>
              <NavLink to="/about" className={navLinkClasses}>About</NavLink>
              <NavLink to="/projects" className={navLinkClasses}>Projects</NavLink>
              <NavLink to="/resume" className={navLinkClasses}>Resume</NavLink>
              <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
            </div>
            <div className="ml-5 flex items-center gap-4">
                <ThemeToggleButton />

                {isAdmin && (
                  <NavLink to="/admin" className="flex items-center text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300">
                    <UserCog className="mr-2 h-5 w-5" />
                    Admin Portal
                  </NavLink>
                )}

                {currentUser ? (
                    <button onClick={logout} className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600">Logout</button>
                ) : (
                    <NavLink to="/login" className="px-3 py-1.5 rounded-md text-sm font-medium bg-sky-600 text-white hover:bg-sky-700">Login</NavLink>
                )}
            </div>
          </div>
          {/* ... (mobile menu and other elements) */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;