
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global error handler for "Failed to fetch" and other network issues
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('Failed to fetch')) {
    console.warn("Global 'Failed to fetch' caught. This is often a network or CORS issue.", event);
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('Failed to fetch')) {
    console.warn("Unhandled Promise Rejection: Failed to fetch.", event.reason);
  }
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
