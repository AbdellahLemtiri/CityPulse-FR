// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   
import App from './App'
import { ContextProvider } from './contexts/ContextProvider'
import { ThemeProvider } from './contexts/ThemeContext' 
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <ThemeProvider>  
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ContextProvider>
  </React.StrictMode>,
)