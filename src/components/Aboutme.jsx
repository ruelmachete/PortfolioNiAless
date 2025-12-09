import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Aboutme.css";

const Aboutme = ({ onBack }) => {
  const [contact, setContact] = useState(null);
  const [about, setAbout] = useState(null);
  const [age, setAge] = useState("N/A");

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch About Info
      const { data: aboutData } = await supabase.from('about_info').select('*').single();
      if (aboutData) {
        setAbout(aboutData);
        if (aboutData.birthday) {
            setAge(calculateAge(aboutData.birthday));
        }
      }

      // 2. Fetch Contact Info
      const { data: contactData } = await supabase.from('contact_info').select('*').single();
      if (contactData) setContact(contactData);
    };
    fetchData();
  }, []);

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  return (
    <section className="aboutme">
      <div className="aboutme-image">
        {/* FIX: Ensure this uses the exact same logic as the main page */}
        <img 
          src={about?.image_url} 
          alt="Profile" 
          onError={(e) => e.target.src = '/logos/alessnobg (2).png'} 
        />
      </div>

      <div className="aboutme-text">
        <h2>Short <span>CV</span></h2>
        <p>
          {about?.description || "Loading description..."}
        </p>
        
        <div className="info">
          <p><b>Age:</b> {age}</p> 
          <p><b>Birthday:</b> {about?.birthday || "N/A"}</p>
          <p><b>Address:</b> {contact?.location || "N/A"}</p>
          <p><b>Nationality:</b> {about?.nationality || "N/A"}</p>
          <p><b>Religion:</b> {about?.religion || "N/A"}</p>
          <p><b>Email:</b> {contact?.email}</p>
        </div>

        <button className="cta-btn" onClick={onBack}>Back</button>
      </div>
    </section>
  );
};

export default Aboutme;