// frontend/src/components/common/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Left Side: Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">About</Link>
              <Link to="/projects" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Projects</Link>
              <Link to="/resume" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Resume</Link>
            </nav>
          </div>
          
          {/* Center: Made By (Clickable) */}
          <div className="flex flex-col items-center justify-center">
            <Link to="/contact" className="group block text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {currentYear}</p>
              <div className="flex items-center justify-center gap-1.5 text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Made by 
                <span className="font-semibold">Harisharan</span>
              </div>
            </Link>
          </div>

          {/* Right Side: Contact Info */}
          <div className="md:text-right">
             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact Me</h3>
             <div className="space-y-2">
                {/* --- THIS IS THE UPDATED LINE --- */}
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=bt21cse016@nituk.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center justify-center md:justify-end gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                    <Mail size={16} />
                    <span>bt21cse016@nituk.ac.in</span>
                </a>
                <div className="flex items-center justify-center md:justify-end gap-2 text-gray-600 dark:text-gray-300">
                    <Phone size={16} />
                    <span>+91 8447173197</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;