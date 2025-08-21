import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../env';

const FeesManagement = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFee, setEditingFee] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', originalPrice: '', description: '', connections: 1 });

  // Fetch connection fees from backend
  const fetchFees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/connection-fees`);
      const data = await response.json();
      if (data.success) {
        setFees(data.fees);
      } else {
        setError('Failed to fetch connection fees');
      }
    } catch (err) {
      setError('Failed to fetch connection fees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (fee) => {
    setEditingFee(fee._id);
    setForm({
      title: fee.title,
      price: fee.price,
      originalPrice: fee.originalPrice,
      description: fee.description,
      connections: fee.connections || 1
    });
  };

  const handleCancel = () => {
    setEditingFee(null);
    setForm({ title: '', price: '', originalPrice: '', description: '', connections: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingFee ? 'PUT' : 'POST';
      const url = editingFee ? `${API_BASE_URL}/admin/connection-fees/${editingFee}` : `${API_BASE_URL}/admin/connection-fees`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          price: Number(form.price),
          originalPrice: Number(form.originalPrice),
          description: form.description,
          connections: Number(form.connections)
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchFees();
        handleCancel();
      } else {
        setError('Failed to save fee');
      }
    } catch (err) {
      setError('Failed to save fee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admin/connection-fees/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchFees();
      } else {
        setError('Failed to delete fee');
      }
    } catch (err) {
      setError('Failed to delete fee');
    }
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Title</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleInputChange} 
              placeholder="Title" 
              required 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db', 
                fontSize: '14px' 
              }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Price</label>
            <input 
              name="price" 
              value={form.price} 
              onChange={handleInputChange} 
              placeholder="Price" 
              type="number" 
              required 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db', 
                fontSize: '14px' 
              }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Original Price</label>
            <input 
              name="originalPrice" 
              value={form.originalPrice} 
              onChange={handleInputChange} 
              placeholder="Original Price" 
              type="number" 
              required 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db', 
                fontSize: '14px' 
              }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Description</label>
            <input 
              name="description" 
              value={form.description} 
              onChange={handleInputChange} 
              placeholder="Description" 
              required 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db', 
                fontSize: '14px' 
              }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Connections</label>
            <input 
              name="connections" 
              value={form.connections} 
              onChange={handleInputChange} 
              placeholder="Number of connections" 
              type="number"
              min="1"
              max="10"
              required 
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db', 
                fontSize: '14px' 
              }} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', gridColumn: 'span 2' }}>
            {editingFee && (
              <button 
                type="button" 
                onClick={handleCancel} 
                style={{
                  padding: '10px 24px',
                  borderRadius: '6px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              style={{
                padding: '10px 24px',
                borderRadius: '6px',
                background: '#ec066a',
                color: 'white',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {editingFee ? 'Update Fee' : 'Add Fee'}
            </button>
          </div>
        </form>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '16px', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '6px', border: '1px solid #fecaca' }}>{error}</div>}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', fontSize: '16px', color: '#6b7280' }}>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ ...thStyle, textAlign: 'left' }}>Title</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Price</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Original Price</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Description</th>
                <th style={{ ...thStyle, textAlign: 'left' }}>Connections</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((fee, index) => (
                <tr key={fee._id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb' }}>
                  <td style={tdStyle}>{fee.title}</td>
                  <td style={tdStyle}>{fee.price}</td>
                  <td style={tdStyle}>{fee.originalPrice}</td>
                  <td style={tdStyle}>{fee.description}</td>
                  <td style={tdStyle}>{fee.connections || 1}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <button 
                      onClick={() => handleEdit(fee)} 
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        background: '#3b82f6', 
                        color: 'white', 
                        border: 'none', 
                        fontWeight: '500', 
                        cursor: 'pointer', 
                        marginRight: '8px',
                        transition: 'background 0.2s'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(fee._id)} 
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: '6px', 
                        background: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        fontWeight: '500', 
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '14px',
  color: '#374151'
};

export default FeesManagement;