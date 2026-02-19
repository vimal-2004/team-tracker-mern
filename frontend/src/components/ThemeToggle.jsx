import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <>
          <span className="text-xl">🌙</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark</span>
        </>
      ) : (
        <>
          <span className="text-xl">☀️</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Light</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle; 