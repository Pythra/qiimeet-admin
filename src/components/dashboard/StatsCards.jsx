import React, { useState, useEffect } from 'react';
import redUsers from '../../assets/images/redusers.png'
import greenUsers from '../../assets/images/greenusers.png'
import circleFace from '../../assets/images/circleface.png'
import { API_BASE_URL } from '../../../env';

export const StatsCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats from backend
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched dashboard stats:', data.stats);
        setStats(data.stats);
      } else {
        setError('Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format number with K suffix
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',  
      }}>
        <StatCard 
          icon={redUsers} 
          value="Loading..."
          label="Total Users"
        />
        <StatCard 
          icon={greenUsers} 
          value="Loading..."
          label="Active Users"
        />
        <StatCard 
          icon={redUsers} 
          value="Loading..."
          label="Blocked Users"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',  
      }}>
        <StatCard 
          icon={redUsers} 
          value="Error"
          label="Total Users"
        />
        <StatCard 
          icon={greenUsers} 
          value="Error"
          label="Active Users"
        />
        <StatCard 
          icon={redUsers} 
          value="Error"
          label="Blocked Users"
        />
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '24px',  
    }}>
      <StatCard 
        icon={redUsers} 
        value={formatNumber(stats?.users?.total || 0)}
        label="Total Users"
      />
      
      <StatCard 
        icon={greenUsers} 
        value={formatNumber(stats?.users?.active || 0)}
        label="Active Users"
      />
      
      <StatCard 
        icon={redUsers} 
        value={formatNumber(stats?.users?.blocked || 0)}
        label="Blocked Users"
      />
    </div>
  )
}

const StatCard = ({ icon, iconBg, value, label }) => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '24px', 
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    height: '272px',
    width: '317px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }}>
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px'
      }}>
        <div style={{ 
          width: '32px', 
          height: '32px',  
          borderRadius: '8px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <img src={icon} alt="" style={{ width: '30px', height: '24px' }} />
        </div>
      </div>
    </div>

    <div style={{ 
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }}>
      <div style={{}}>
        <div style={{  marginBottom: '13px' ,fontSize: '32px', fontWeight: '600', color: '#111827' }}>
          {value}
        </div>
        <div style={{ color: '#6b7280', fontSize: '14px' }}>
          {label}
        </div>
      </div>
      <img 
        src={circleFace} 
        style={{ width: '72px', height: '24px' }} 
        alt="" 
      />
    </div>
  </div>
)

const SubscriptionManagement = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOption, setEditingOption] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', originalPrice: '', description: '' });

  // Fetch subscription options from backend
  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/subscription-options`);
      const data = await response.json();
      if (data.success) {
        setOptions(data.options);
      } else {
        setError('Failed to fetch subscription options');
      }
    } catch (err) {
      setError('Failed to fetch subscription options');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (option) => {
    setEditingOption(option._id);
    setForm({
      title: option.title,
      price: option.price,
      originalPrice: option.originalPrice,
      description: option.description
    });
  };

  const handleCancel = () => {
    setEditingOption(null);
    setForm({ title: '', price: '', originalPrice: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingOption ? 'PUT' : 'POST';
      const url = editingOption ? `${API_BASE_URL}/admin/subscription-options/${editingOption}` : `${API_BASE_URL}/admin/subscription-options`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          price: Number(form.price),
          originalPrice: Number(form.originalPrice),
          description: form.description
        })
      });
      const data = await response.json();
      if (data.success) {
        fetchOptions();
        handleCancel();
      } else {
        setError('Failed to save option');
      }
    } catch (err) {
      setError('Failed to save option');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this option?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admin/subscription-options/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        fetchOptions();
      } else {
        setError('Failed to delete option');
      }
    } catch (err) {
      setError('Failed to delete option');
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', padding: 24 }}>
      <h2 style={{ fontWeight: 600, fontSize: 24, marginBottom: 24 }}>Manage Subscription Options</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <input name="title" value={form.title} onChange={handleInputChange} placeholder="Title" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }} />
        <input name="price" value={form.price} onChange={handleInputChange} placeholder="Price" type="number" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 100 }} />
        <input name="originalPrice" value={form.originalPrice} onChange={handleInputChange} placeholder="Original Price" type="number" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 100 }} />
        <input name="description" value={form.description} onChange={handleInputChange} placeholder="Description" required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }} />
        <button type="submit" style={{ padding: '8px 16px', borderRadius: 4, background: '#10b981', color: '#fff', border: 'none', fontWeight: 600 }}>{editingOption ? 'Update' : 'Add'}</button>
        {editingOption && <button type="button" onClick={handleCancel} style={{ padding: '8px 16px', borderRadius: 4, background: '#ef4444', color: '#fff', border: 'none', fontWeight: 600 }}>Cancel</button>}
      </form>
      {error && <div style={{ color: '#ef4444', marginBottom: 16 }}>{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Original Price</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {options.map(option => (
              <tr key={option._id}>
                <td style={tdStyle}>{option.title}</td>
                <td style={tdStyle}>{option.price}</td>
                <td style={tdStyle}>{option.originalPrice}</td>
                <td style={tdStyle}>{option.description}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(option)} style={{ marginRight: 8, padding: '4px 8px', borderRadius: 4, background: '#3b82f6', color: '#fff', border: 'none' }}>Edit</button>
                  <button onClick={() => handleDelete(option._id)} style={{ padding: '4px 8px', borderRadius: 4, background: '#ef4444', color: '#fff', border: 'none' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: '500',
  color: '#6b7280'
};

const tdStyle = {
  padding: '12px 16px',
  fontSize: '14px'
};

export default SubscriptionManagement;
