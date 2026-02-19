import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SatelliteProvider } from './context/SatelliteContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SatelliteProvider>
      <App />
    </SatelliteProvider>
  </StrictMode>,
)
