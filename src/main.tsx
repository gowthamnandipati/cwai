import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import { FontSizeProvider } from './contexts/FontSizeContext'; // ✅ Import

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FontSizeProvider>
      <App />
    </FontSizeProvider>
  </StrictMode>
);
