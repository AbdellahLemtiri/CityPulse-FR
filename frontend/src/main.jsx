import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ContextProvider } from './contexts/ContextProvider' // <--- زيد هادي
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>     {/* <--- غلفنا بيها كولشي هنا */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextProvider>
  </React.StrictMode>,
)