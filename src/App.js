import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your existing public components
import Header from './components/Header'; // Assuming your path
import About from './components/About';
import Projects from './components/Projects'; // This will be the NEW UPDATED Projects
import Skills from './components/Skills';     // This will be the NEW UPDATED Skills
import Certificates from './components/Email'; // Your Certificates file was named Email.jsx?
import Footer from './components/Footer';

// Import Admin Components
import Login from './admin/Login';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE (Your Portfolio) */}
        <Route path="/" element={
          <>
            <Header />
            <section id="about"><About /></section>
            <section id="skills"><Skills /></section>
            <section id="projects"><Projects /></section>
            <section id="certificates"><Certificates /></section>
            <Footer />
          </>
        } />

        {/* ADMIN ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;