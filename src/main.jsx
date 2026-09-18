import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { PreCheckoutProvider } from './context/PreCheckoutContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PreCheckoutProvider>
        <App />
      </PreCheckoutProvider>
    </AuthProvider>
  </StrictMode>
);
