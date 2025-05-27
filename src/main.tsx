import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css';
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ErrorBoundary>
          <StyledEngineProvider enableCssLayer>
              <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
              <App />
          </StyledEngineProvider>

      </ErrorBoundary>
  </StrictMode>,
)
