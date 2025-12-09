import React, { useState } from 'react';
import './App.css';

// Import Components
import Header from './components/Header';
import About from './components/About';
import Aboutme from './components/Aboutme';
import Quotes from './components/Quotes'; // IMPORT ADDED
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Email'; 
import Contact from './components/Contact';
import Footer from './components/Footer';
import Api from './components/Api'; 

function App() {
  const [showAboutMe, setShowAboutMe] = useState(false);

  return (
    <div className="App">
      {/* 1. Chatbot */}
      <Api />

      {/* 2. Header/Nav */}
      <Header />
      
      {/* 3. About Me Overlay (Popup) */}
      {showAboutMe && (
        <div className="aboutme-overlay">
          <Aboutme onBack={() => setShowAboutMe(false)} />
        </div>
      )}

      {/* 4. Main Content Sections */}
      <main>
        <section id="about">
          <About onShowMore={() => setShowAboutMe(true)} />
        </section>

        {/* Quotes Section Added Here */}
        <section id="quotes">
          <Quotes />
        </section>

        <section id="skills">
          <Skills />
        </section>

        <section id="projects">
          <Projects />
        </section>

        <section id="certificates">
          <Certificates />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;