import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { validateEnvironmentVariables } from './utils/envValidator.js'

// Validate environment variables on startup
const envValidation = validateEnvironmentVariables();

if (!envValidation.isValid) {
  console.error('Application startup blocked due to missing environment variables');
  document.getElementById('root').innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 20px; background: #fee; border-radius: 8px; max-width: 500px;">
        <h1 style="color: #c00;">Configuration Error</h1>
        <p>Application cannot start due to missing environment variables.</p>
        <p>Please check the console for details and your .env.local file.</p>
      </div>
    </div>
  `;
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

