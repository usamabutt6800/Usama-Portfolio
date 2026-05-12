// src/main.tsx
// Application entry point — mounts React and initializes Lenis smooth scroll

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initSmoothScroll } from './lib/smoothScroll';

// Initialize Lenis smooth scrolling globally
initSmoothScroll();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
