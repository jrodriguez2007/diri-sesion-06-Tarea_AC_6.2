import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootswatch/dist/darkly/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
