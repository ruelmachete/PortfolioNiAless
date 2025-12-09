import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import './About.css';

const About = ({ onShowMore }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data } = await supabase.from('about_info').select('*').limit(1).single();
      if (data) setData(data);
    };
    fetchAbout();
  }, []);

  const display = data || {
    greeting: "Hey, there",
    name: "I AM ALESSANDRA",
    title: "IT Student • Aspiring Developer",
    description: "As an IT student, I love exploring technology and design...",
    image_url: "/logos/alessnobg (2).png"
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

        {/* IMPORTANT: This triggers the function passed from App.jsx */}
        <button onClick={onShowMore} className="cta-btn">About Me</button>
      </div>

      <div className="about-image">
        <img 
          src={display.image_url || "/logos/alessnobg (2).png"} 
          alt="Alessandra" 
          onError={(e) => e.target.src = '/logos/alessnobg (2).png'}
        />
      </div>
    </section>
  );
};

export default About;