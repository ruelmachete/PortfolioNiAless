import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx' // Your Main Portfolio
import Login from './admin/Login.jsx' // Your Admin Login
import AdminDashboard from './admin/AdminDashboard.jsx' // Your Admin Dashboard (Ensure this file exists)
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route for the Main Portfolio */}
        <Route path="/" element={<App />} />

        {/* Route for Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* Route for Admin Dashboard (Protected) */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)