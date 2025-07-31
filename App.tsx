import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import './styles.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
};

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

const MainContent: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div className={`app ${theme}`}>
      <ThemeToggle />
      <div className="container">
        {/* Your app content goes here */}
      </div>
    </div>
  );
};

export default App;