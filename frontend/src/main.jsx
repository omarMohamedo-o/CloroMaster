import React from 'react';
import { createRoot } from 'react-dom/client';
// Use new app entry point (re-export) to match `src/app/App.jsx` structure
import App from './app/App';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);