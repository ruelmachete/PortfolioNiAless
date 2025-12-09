import React, { useState } from 'react';
import './App.css';

// Import Components
import Background from './components/Background';
import Header from './components/Header';
import About from './components/About';
import Aboutme from './components/Aboutme';
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
      {/* 1. Background Animation (Must be at top to render behind) */}
      <Background />
      
      {/* 2. Chatbot */}
      <Api />

      {/* 3. Navigation */}
      <Header />
      
      {/* 4. Popup Overlay */}
      {showAboutMe && (
        <div className="aboutme-overlay">
          <Aboutme onBack={() => setShowAboutMe(false)} />
        </div>
      )}

      {/* 5. Main Content Area */}
      <main>
        <section id="about">
          <About onShowMore={() => setShowAboutMe(true)} />
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