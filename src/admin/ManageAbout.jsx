import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ManageAbout = () => {
  const [form, setForm] = useState({ greeting: '', name: '', title: '', description: '' });
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
        reject(err);
      } finally {
        setLoading(false);
      }
    });

    toast.promise(promise, {
      loading: 'Saving profile...',
      success: 'Profile updated!',
      error: 'Failed to update',
    });
  };

  return (
    <div>
      <h1 className="section-header">Manage About Me</h1>
      <p className="section-subtitle">Edit your introduction and biography.</p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input value={form.greeting} placeholder=" " onChange={e => setForm({...form, greeting: e.target.value})} />
          <label>Greeting</label>
        </div>
        <div className="form-group">
          <input value={form.name} placeholder=" " onChange={e => setForm({...form, name: e.target.value})} />
          <label>Name</label>
        </div>
        <div className="form-group">
          <input value={form.title} placeholder=" " onChange={e => setForm({...form, title: e.target.value})} />
          <label>Job Title</label>
        </div>
        <div className="form-group">
          <textarea rows="5" value={form.description} placeholder=" " onChange={e => setForm({...form, description: e.target.value})} />
          <label>Bio</label>
        </div>
        <div className="form-group">
          <label style={{position:'relative', top:0, left:0, marginBottom:10}}>Profile Image</label>
          <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
            <input type="file" onChange={e => setImageFile(e.target.files[0])} />
            {currentImage && <img src={currentImage} alt="Current" style={{width:'60px', height:'60px', borderRadius:'10px', objectFit:'cover'}} />}
          </div>
        </div>
        <button type="submit" className="save-btn" disabled={loading}>Save Changes</button>
      </form>
    </div>
  );
};

export default ManageAbout;