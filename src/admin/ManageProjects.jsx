import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', link: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('id', { ascending: false });
    setProjects(data || []);
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        let imageUrl = form.image_url;
        if (imageFile) {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `project-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('portfolio').upload(fileName, imageFile);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }

        const projectData = { title: form.title, description: form.description, link: form.link, image_url: imageUrl };

        if (editingId) {
          await supabase.from('projects').update(projectData).eq('id', editingId);
        } else {
          await supabase.from('projects').insert([projectData]);
        }

        setForm({ title: '', description: '', link: '' });
        setImageFile(null);
        setEditingId(null);
        fetchProjects();
        resolve();
      } catch (err) { reject(err); } finally { setLoading(false); }
    });

    toast.promise(promise, { loading: 'Saving...', success: 'Saved!', error: 'Error' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete?')) {
      const promise = supabase.from('projects').delete().eq('id', id);
      toast.promise(promise, {
        loading: 'Deleting...', success: () => { fetchProjects(); return 'Deleted!'; }, error: 'Error'
      });
    }
  };

  return (
    <div>
      <h1 className="section-header">Manage Projects</h1>
      <p className="section-subtitle">Add or edit your portfolio projects.</p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group"><input type="text" placeholder=" " value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /><label>Title</label></div>
        <div className="form-group"><textarea rows="3" placeholder=" " value={form.description} onChange={e => setForm({...form, description: e.target.value})} required /><label>Description</label></div>
        <div className="form-group"><input type="text" placeholder=" " value={form.link || ''} onChange={e => setForm({...form, link: e.target.value})} /><label>Link</label></div>
        <div className="form-group"><label style={{position:'relative', top:0}}>Image</label><input type="file" onChange={e => setImageFile(e.target.files[0])} /></div>
        <button type="submit" className="save-btn" disabled={loading}>{editingId ? 'Update' : 'Add'}</button>
      </form>

      <div className="item-list">
        {projects.map((proj, i) => (
          <motion.div key={proj.id} className="admin-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <img src={proj.image_url} alt="proj" onError={(e) => e.target.src='https://via.placeholder.com/300'} />
            <h4>{proj.title}</h4>
            <div className="card-actions">
              <button className="edit-btn" onClick={() => {setEditingId(proj.id); setForm(proj); window.scrollTo(0,0);}}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(proj.id)}>Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageProjects;