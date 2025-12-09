import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import toast from 'react-hot-toast';

const ManageContact = () => {
  const [form, setForm] = useState({ email: '', phone: '', location: '', facebook: '', twitter: '', instagram: '' });
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);

  const fetchContact = async () => {
    const { data } = await supabase.from('contact_info').select('*').limit(1).single();
    if (data) { setForm(data); setId(data.id); }
  };

  useEffect(() => { fetchContact(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
        try {
            if (id) await supabase.from('contact_info').update(form).eq('id', id);
            else await supabase.from('contact_info').insert([form]);
            fetchContact();
            resolve();
        } catch (error) { reject(error); } finally { setLoading(false); }
    });

    toast.promise(promise, { loading: 'Saving...', success: 'Updated!', error: 'Error' });
  };

  return (
    <div>
      <h1 className="section-header">Manage Contact Info</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group"><input value={form.email} placeholder=" " onChange={e => setForm({...form, email: e.target.value})} /><label>Email</label></div>
        <div className="form-group"><input value={form.phone} placeholder=" " onChange={e => setForm({...form, phone: e.target.value})} /><label>Phone</label></div>
        <div className="form-group"><input value={form.location} placeholder=" " onChange={e => setForm({...form, location: e.target.value})} /><label>Location</label></div>
        <h3 style={{marginTop:'30px', color:'var(--primary)'}}>Social Links</h3>
        <div className="form-group"><input value={form.facebook} placeholder=" " onChange={e => setForm({...form, facebook: e.target.value})} /><label>Facebook URL</label></div>
        <div className="form-group"><input value={form.instagram} placeholder=" " onChange={e => setForm({...form, instagram: e.target.value})} /><label>Instagram URL</label></div>
        <button type="submit" className="save-btn" disabled={loading}>Save Changes</button>
      </form>
    </div>
  );
};

export default ManageContact;