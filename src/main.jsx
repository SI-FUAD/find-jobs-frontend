import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'

if (!localStorage.getItem("Find Jobs Data")) {
  localStorage.setItem(
    "Find Jobs Data",
    JSON.stringify({
      users: [],
      companies: [],
      jobs: [],
      others: [
        {
          type: "admin",
          email: "admin@findjobs.com",
          password: "admin123",
        },
        {
          type: "currentUser",
          data: null
        }
      ],
    })
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)