import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ManageAbout = () => {
  const [form, setForm] = useState({ 
    greeting: '', 
    name: '', 
    title: '', 
    description: '',
    birthday: '',
    nationality: '',
    religion: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const fetchAbout = async () => {
    const { data } = await supabase.from('about_info').select('*').limit(1).single();
    if (data) {
      setForm(data);
      setId(data.id);
      setCurrentImage(data.image_url);
    }
  };

  useEffect(() => { fetchAbout(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        let imageUrl = currentImage; 

        if (imageFile) {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `about-${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('portfolio') 
            .upload(fileName, imageFile, { upsert: true });

          if (uploadError) throw uploadError;

          const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }

        const dataToSave = { ...form, image_url: imageUrl };

        if (id) {
          await supabase.from('about_info').update(dataToSave).eq('id', id);
        } else {
          await supabase.from('about_info').insert([dataToSave]);
        }
        
        setCurrentImage(imageUrl);
        fetchAbout();
        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: 'Saving profile...',
      success: 'Profile updated successfully!',
      error: (err) => `Error: ${err.message}`,
    });
  };

  return (
    <div>
      <h1 className="section-header">Manage About Me</h1>
      <p className="section-subtitle">Edit your introduction, biography, and profile picture.</p>

      <form className="admin-form" onSubmit={handleSubmit}>
        
        <h3 style={{color:'var(--primary)', marginBottom:'15px'}}>Main Info</h3>
        <div className="form-group">
          <label>Greeting</label>
          <input value={form.greeting || ''} onChange={e => setForm({...form, greeting: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Job Title</label>
          <input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Full Bio / Description</label>
          <textarea rows="5" value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        <h3 style={{color:'var(--primary)', marginTop:'30px', marginBottom:'15px'}}>Personal Details (CV)</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
            <div className="form-group">
              <label>Birthday</label>
              <input type="date" value={form.birthday || ''} onChange={e => setForm({...form, birthday: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <input value={form.nationality || ''} onChange={e => setForm({...form, nationality: e.target.value})} />
            </div>
        </div>
        <div className="form-group">
          <label>Religion</label>
          <input value={form.religion || ''} onChange={e => setForm({...form, religion: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Profile Image</label>
          <div style={{display:'flex', gap:'20px', alignItems:'center', marginTop:'5px'}}>
            <input type="file" onChange={e => setImageFile(e.target.files[0])} />
            <div style={{width:'80px', height:'80px', borderRadius:'10px', overflow:'hidden', border:'1px solid #ddd', background:'#f9f9f9'}}>
              {imageFile ? <img src={URL.createObjectURL(imageFile)} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : currentImage ? <img src={currentImage} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : null}
            </div>
          </div>
        </div>

        <button type="submit" className="save-btn" disabled={loading}>Save Changes</button>
      </form>
    </div>
  );
};

export default ManageAbout;