import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../env';

const DeletionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/admin/deletion-requests`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to load requests');
      setRequests(data.requests);
    } catch (e) {
      setError(e.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/deletion-requests/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to update');
      await load();
    } catch (e) {
      alert(e.message || 'Failed to update');
    }
  };

  const complete = async (id) => {
    try {
      if (!window.confirm('This will permanently delete the user and their data. Proceed?')) return;
      const res = await fetch(`${API_BASE_URL}/admin/deletion-requests/${id}/complete`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed to complete');
      await load();
    } catch (e) {
      alert(e.message || 'Failed to complete');
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (error) return <div style={{ padding: 24, color: '#ef4444' }}>{error}</div>;

  return (
    <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Data Deletion Requests</h2>
        <button onClick={load} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}>Refresh</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
            <th style={th}>Email</th>
            <th style={th}>Phone</th>
            <th style={th}>Reason</th>
            <th style={th}>Status</th>
            <th style={th}>Created</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr><td colSpan="6" style={{ padding: 16, textAlign: 'center', color: '#6b7280' }}>No requests</td></tr>
          ) : (
            requests.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={td}>{r.email || '-'}</td>
                <td style={td}>{r.phone || '-'}</td>
                <td style={td}>{r.reason || '-'}</td>
                <td style={td}><span style={{ padding: '4px 8px', borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }}>{r.status}</span></td>
                <td style={td}>{new Date(r.createdAt).toLocaleString()}</td>
                <td style={td}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => updateStatus(r._id, 'approved')} style={btn('#2563eb')}>Approve</button>
                    <button onClick={() => updateStatus(r._id, 'rejected')} style={btn('#f59e0b')}>Reject</button>
                    <button onClick={() => complete(r._id)} style={btn('#ef4444')}>Complete & Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const th = { textAlign: 'left', padding: '12px 16px', fontSize: 14, color: '#6b7280' };
const td = { padding: '12px 16px', fontSize: 14 };
const btn = (bg) => ({ background: bg, color: 'white', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' });

export default DeletionRequests;


