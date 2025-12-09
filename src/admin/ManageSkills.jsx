import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSkills = async () => {
    const { data } = await supabase.from('skills').select('*').order('id', { ascending: true });
    setSkills(data || []);
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        let imageUrl = form.image_url;
        if (imageFile) {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `skill-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from('portfolio').upload(fileName, imageFile);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }

        const skillData = { name: form.name, description: form.description, image_url: imageUrl };

        if (editingId) {
          await supabase.from('skills').update(skillData).eq('id', editingId);
        } else {
          await supabase.from('skills').insert([skillData]);
        }

        setForm({ name: '', description: '' });
        setImageFile(null);
        setEditingId(null);
        fetchSkills();
        resolve();
      } catch (err) { reject(err); } finally { setLoading(false); }
    });

    toast.promise(promise, { loading: 'Saving...', success: 'Saved!', error: 'Error' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete?')) {
      const promise = supabase.from('skills').delete().eq('id', id);
      toast.promise(promise, { loading: 'Deleting...', success: () => { fetchSkills(); return 'Deleted'; }, error: 'Error' });
    }
  };

  return (
    <div>
      <h1 className="section-header">Manage Skills</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group"><input value={form.name} placeholder=" " onChange={e => setForm({...form, name: e.target.value})} required /><label>Skill Name</label></div>
        <div className="form-group"><input value={form.description || ''} placeholder=" " onChange={e => setForm({...form, description: e.target.value})} /><label>Description</label></div>
        <div className="form-group"><label style={{position:'relative', top:0}}>Icon</label><input type="file" onChange={e => setImageFile(e.target.files[0])} /></div>
        <button type="submit" className="save-btn" disabled={loading}>{editingId ? 'Update' : 'Add'}</button>
      </form>

      <div className="item-list">
        {skills.map((skill, i) => (
          <motion.div key={skill.id} className="admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
               <img src={skill.image_url} alt={skill.name} style={{width:'50px', height:'50px', objectFit:'contain', margin:0, background:'transparent'}} />
               <h4 style={{margin:0}}>{skill.name}</h4>
            </div>
            <div className="card-actions">
              <button className="edit-btn" onClick={() => { setEditingId(skill.id); setForm(skill); }}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(skill.id)}>Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageSkills;