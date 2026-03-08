
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global protection for window.fetch to prevent third-party scripts from crashing the app
// when they try to overwrite the read-only fetch property.
// This must run before any other scripts.
try {
  const originalFetch = window.fetch;
  if (originalFetch) {
    Object.defineProperty(window, 'fetch', {
      get: () => originalFetch,
      set: (v) => {
        console.warn("A script attempted to overwrite window.fetch. This was blocked to prevent a crash.", v);
      },
      configurable: true
    });
  }
} catch (e) {
  // If we can't redefine it, we just continue
}

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
