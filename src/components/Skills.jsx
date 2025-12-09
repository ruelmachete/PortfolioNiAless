import React, { useEffect, useRef, useState } from "react";
import "./Skills.css";
import { supabase } from '../supabaseClient';

function Skills() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [skillsList, setSkillsList] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    
    // Fetch from Supabase
    const fetchSkills = async () => {
      const { data } = await supabase.from('skills').select('*').order('id', { ascending: true });
      if(data) setSkillsList(data);
    };
    fetchSkills();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="skills-section">
      <h2 className="skills-title">My Skills</h2>
      <div ref={ref} className={`skills ${isVisible ? "show" : ""}`}>
        {skillsList.map((skill) => (
          <div key={skill.id} className="card">
            <img src={skill.image_url} alt={skill.name} />
            <h3>{skill.name}</h3>
            <p>{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skills;