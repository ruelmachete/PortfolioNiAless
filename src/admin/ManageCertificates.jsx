import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageCertificates = () => {
  const [certs, setCerts] = useState([]);
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCerts = async () => {
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
    setCerts(data || []);
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile && !title) return;
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        let imageUrl = '';
        if (imageFile) {
          const fileName = `cert-${Date.now()}`;
          await supabase.storage.from('portfolio').upload(fileName, imageFile);
          const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }

        await supabase.from('certificates').insert([{ title, image_url: imageUrl }]);
        setTitle('');
        setImageFile(null);
        fetchCerts();
        resolve();
      } catch (error) { reject(error); } finally { setLoading(false); }
    });

    toast.promise(promise, { loading: 'Uploading...', success: 'Added!', error: 'Error' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete?')) {
      const promise = supabase.from('certificates').delete().eq('id', id);
      toast.promise(promise, { loading: 'Deleting...', success: () => { fetchCerts(); return 'Deleted'; }, error: 'Error' });
    }
  };

  return (
    <div>
      <h1 className="section-header">Manage Certificates</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group"><input value={title} placeholder=" " onChange={e => setTitle(e.target.value)} /><label>Title</label></div>
        <div className="form-group"><label style={{position:'relative', top:0}}>Image</label><input type="file" onChange={e => setImageFile(e.target.files[0])} required /></div>
        <button type="submit" className="save-btn" disabled={loading}>Add Certificate</button>
      </form>

      <div className="item-list">
        {certs.map((cert, i) => (
          <motion.div key={cert.id} className="admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
            <img src={cert.image_url} alt="cert" />
            <h4>{cert.title}</h4>
            <div className="card-actions"><button className="delete-btn" onClick={() => handleDelete(cert.id)}>Delete</button></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageCertificates;