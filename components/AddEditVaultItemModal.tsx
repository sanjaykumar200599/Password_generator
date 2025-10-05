// components/AddEditVaultItemModal.tsx

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { encryptData } from '@/lib/crypto';

export default function AddEditVaultItemModal({ item, onClose, onSave }) {
  const { encryptionKey } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    tags: '' // Stored as a comma-separated string in the form
  });

  const isEditing = !!item;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: item.title || '',
        username: item.username || '',
        password: item.password || '',
        url: item.url || '',
        notes: item.notes || '',
        tags: item.tags ? item.tags.join(', ') : ''
      });
    }
  }, [item, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!encryptionKey) {
      alert('Encryption key is not available. Please log in again.');
      return;
    }

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    // Encrypt all data before sending to the server
    const encryptedData = {
      title: encryptData(formData.title, encryptionKey),
      username: encryptData(formData.username, encryptionKey),
      password: encryptData(formData.password, encryptionKey),
      url: encryptData(formData.url, encryptionKey),
      notes: encryptData(formData.notes, encryptionKey),
      tags: tagsArray.map(tag => encryptData(tag, encryptionKey)),
    };

    const url = isEditing ? `/api/vault/${item._id}` : '/api/vault';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encryptedData),
      });

      if (res.ok) {
        onSave();
        onClose();
      } else {
        const errorData = await res.json();
        alert(`Failed to save item: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving the item.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Item' : 'Add New Item'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded-md bg-muted" />
          <input name="username" value={formData.username} onChange={handleChange} placeholder="Username/Email" required className="w-full p-2 border rounded-md bg-muted" />
          <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full p-2 border rounded-md bg-muted" />
          <input name="url" value={formData.url} onChange={handleChange} placeholder="URL (e.g., example.com)" className="w-full p-2 border rounded-md bg-muted" />
          <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes" className="w-full p-2 border rounded-md bg-muted h-24" />
          <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" className="w-full p-2 border rounded-md bg-muted" />
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 text-white bg-primary rounded-md">{isEditing ? 'Save Changes' : 'Save Item'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}