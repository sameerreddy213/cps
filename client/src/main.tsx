import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Keep this
import './App.css'  // <--- ADD THIS LINE
import App from './App.tsx'
import React from 'react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);