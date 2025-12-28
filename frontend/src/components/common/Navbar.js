// frontend/src/components/common/Navbar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggleButton from './ThemeToggleButton';
import { useSettings } from '../../contexts/SettingsContext';
import { UserCog, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const { siteSettings } = useSettings();

  const navLinkClasses = ({ isActive }) =>
    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'text-sky-600 dark:text-sky-400 font-semibold bg-sky-50 dark:bg-sky-900/20'
        : 'text-gray-700 hover:text-sky-600 dark:text-gray-300 dark:hover:text-sky-400 hover:bg-gray-50 dark:hover:bg-slate-800'
    }`;
    
  const mobileNavLinkClasses = ({ isActive }) =>
    `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
    }`;

  const handleMobileLinkClick = () => setIsOpen(false);

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <NavLink 
              to="/" 
              className="text-gray-800 dark:text-white font-bold text-xl md:text-2xl bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent hover:from-sky-500 hover:to-blue-500 transition-all duration-300"
            >
              {siteSettings.ownerName || 'Harisharan'}
              {isAdmin && <span className="text-sm font-normal text-sky-500 ml-2">(Admin)</span>}
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-center space-x-2">
              <NavLink to="/" className={navLinkClasses}>Home</NavLink>
              <NavLink to="/about" className={navLinkClasses}>About</NavLink>
              <NavLink to="/projects" className={navLinkClasses}>Projects</NavLink>
              <NavLink to="/resume" className={navLinkClasses}>Resume</NavLink>
              <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
            </div>
            <div className="ml-6 flex items-center gap-3">
                <ThemeToggleButton />

                {isAdmin && (
                  <NavLink 
                    to="/admin" 
                    className="flex items-center text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-200"
                  >
                    <UserCog className="mr-2 h-4 w-4" />
                    Admin
                  </NavLink>
                )}

                {currentUser ? (
                    <button 
                      onClick={logout} 
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Logout
                    </button>
                ) : (
                    <NavLink 
                      to="/login" 
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      Login
                    </NavLink>
                )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggleButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              <NavLink to="/" className={mobileNavLinkClasses} onClick={handleMobileLinkClick}>
                Home
              </NavLink>
              <NavLink to="/about" className={mobileNavLinkClasses} onClick={handleMobileLinkClick}>
                About
              </NavLink>
              <NavLink to="/projects" className={mobileNavLinkClasses} onClick={handleMobileLinkClick}>
                Projects
              </NavLink>
              <NavLink to="/resume" className={mobileNavLinkClasses} onClick={handleMobileLinkClick}>
                Resume
              </NavLink>
              <NavLink to="/contact" className={mobileNavLinkClasses} onClick={handleMobileLinkClick}>
                Contact
              </NavLink>
              
              {isAdmin && (
                <NavLink 
                  to="/admin" 
                  className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-700 transition-all duration-200"
                  onClick={handleMobileLinkClick}
                >
                  <UserCog className="mr-2 h-5 w-5" />
                  Admin Portal
                </NavLink>
              )}

              <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                {currentUser ? (
                  <button 
                    onClick={() => { logout(); handleMobileLinkClick(); }} 
                    className="w-full px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md transition-all duration-200"
                  >
                    Logout
                  </button>
                ) : (
                  <NavLink 
                    to="/login" 
                    className="block w-full text-center px-4 py-3 rounded-lg text-base font-medium bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-700 hover:to-blue-700 shadow-md transition-all duration-200"
                    onClick={handleMobileLinkClick}
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;