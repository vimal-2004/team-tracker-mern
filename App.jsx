import React from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import './styles.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === 'light' ? '🌙' : '☀️'}
      <span style={{ fontSize: '0.9rem', marginLeft: 8 }}>
        {theme === 'light' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
};

const MainContent = () => {
  const { theme } = useTheme();
  return (
    <div className={`app ${theme}`}>
      <ThemeToggle />
      <div className="container">
        <div className="card">
          <h1 style={{ marginTop: 0, marginBottom: '1rem' }}>Welcome to Your App</h1>
          <p style={{ color: theme === 'light' ? 'var(--text-secondary-light)' : 'var(--text-secondary-dark)' }}>
            This is a sample application demonstrating light and dark mode functionality.
          </p>

          <div style={{ marginTop: '2rem' }}>
            <h3>Sample Form</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name:</label>
              <input type="text" className="input" placeholder="Enter your name" defaultValue="John Doe" />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
              <input type="email" className="input" placeholder="Enter your email" defaultValue="john@example.com" />
            </div>
            <button className="button">Submit</button>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3>Theme Information</h3>
            <p>
              Current theme: <strong>{theme}</strong>
            </p>
            <p>Click the theme toggle button in the top-right corner to switch themes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
};

export default App;
