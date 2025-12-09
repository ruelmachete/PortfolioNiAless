import React, { useEffect, useState } from 'react';
import './Projects.css';
import { supabase } from '../supabaseClient';

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="projects-section">
      <h2 className="projects-title">Projects</h2>
      <div className="projects">
        {projects.map((project) => (
          <div key={project.id} className="card">
            <img src={project.image_url} alt={project.title} onError={(e) => e.target.src='https://via.placeholder.com/300'} />
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="btn">View Project</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;