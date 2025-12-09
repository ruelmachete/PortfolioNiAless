import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import './About.css';

const About = ({ onShowMore }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data, error } = await supabase
        .from('about_info')
        .select('*')
        .limit(1)
        .single();
      
      if (data) setData(data);
    };
    fetchAbout();
  }, []);

  const display = data || {
    greeting: "Hey, there",
    name: "I AM ALESSANDRA",
    title: "IT Student • Aspiring Developer",
    description: "Loading...",
    image_url: null // Will trigger fallback
  };

  return (
    <section className="about">
      <div className="about-text">
        <h2>{display.greeting}</h2>
        <h1 dangerouslySetInnerHTML={{ 
          __html: display.name.replace('ALESSANDRA', '<span class="highlight">ALESSANDRA</span>') 
        }} />
        <h3>{display.title}</h3>
        <p>{display.description}</p>

        <button onClick={onShowMore} className="cta-btn">About Me</button>
      </div>

      <div className="about-image">
        {/* FIX: Same error handling as Aboutme.jsx */}
        <img 
          src={display.image_url} 
          alt="Alessandra" 
          onError={(e) => e.target.src = '/logos/alessnobg (2).png'}
        />
      </div>
    </section>
  );
};

export default About;