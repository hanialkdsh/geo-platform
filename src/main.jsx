import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Validate environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_ANTHROPIC_API_KEY',
];

const missingVars = requiredEnvVars.filter((varName) => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars);
  console.error('Please create .env.local file with required variables');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
