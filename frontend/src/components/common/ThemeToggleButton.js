// frontend/src/components/common/ThemeToggleButton.js
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext'; // Adjust path if your ThemeContext is elsewhere
import { Sun, Moon } from 'lucide-react'; // Icons from lucide-react

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted before rendering UI that depends on the theme
  // This helps avoid hydration mismatches if the server-rendered HTML (if any)
  // doesn't match the client-side theme preference from localStorage.
  // For CRA, this mainly ensures state is ready.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // You can return a placeholder or null to avoid rendering mismatch during hydration
    // For a simple button, returning a styled div to reserve space might be good.
    return <div style={{ width: '2.25rem', height: '2.25rem' }} />; // Same size as button (h-9 w-9)
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-md hover:bg-gray-700 dark:hover:bg-gray-600 text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 dark:focus:ring-offset-gray-900 focus:ring-white transition-colors duration-200"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" /> // Show sun icon in dark mode (to switch to light)
      ) : (
        <Moon className="h-5 w-5" /> // Show moon icon in light mode (to switch to dark)
      )}
    </button>
  );
};

export default ThemeToggleButton;