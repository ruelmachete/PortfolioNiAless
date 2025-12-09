import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./Aboutme.css";

const Aboutme = ({ onBack }) => {
  const [contact, setContact] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: aboutData } = await supabase.from('about_info').select('*').single();
      if (aboutData) setAbout(aboutData);

      const { data: contactData } = await supabase.from('contact_info').select('*').single();
      if (contactData) setContact(contactData);
    };
    fetchData();
  }, []);

  return (
    <section className="aboutme">
      <div className="aboutme-image">
        <img src={about?.image_url || "/logos/ale2x2.jpg"} alt="Alessandra CV" />
      </div>

      <div className="aboutme-text">
        <h2>Short <span>CV</span></h2>
        <p>
          {about?.description || "Hi! I’m Alessandra Nicole C. Santiago..."}
        </p>
        
        <div className="info">
          <p><b>Address:</b> {contact?.location || "Plaridel, Bulacan"}</p>
          <p><b>Email:</b> {contact?.email || "alessandranixxx@gmail.com"}</p>
          <p><b>Phone:</b> {contact?.phone || "+63 912 345 6789"}</p>
          <p><b>Nationality:</b> Filipino</p>
        </div>

        {/* IMPORTANT: This triggers the close function */}
        <button className="cta-btn" onClick={onBack}>Back</button>
      </div>
    </section>
  );
};

export default Aboutme;