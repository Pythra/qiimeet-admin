import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../env';

const DisputeManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRespondBox, setOpenRespondBox] = useState({});
  const [responses, setResponses] = useState({});

  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/reports/admin/all`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
        setError(null);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const toggleRespondBox = (id) => {
    setOpenRespondBox((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleResponseChange = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleStatusUpdate = async (reportId, newStatus, adminNotes = '') => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/reports/admin/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: adminNotes
        })
      });

      const result = await response.json();
      if (result.success) {
        // Refresh reports
        await fetchReports();
        alert(`Report ${newStatus} successfully`);
      } else {
        alert('Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Error updating report');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendResponse = async (id) => {
    const responseText = responses[id];
    if (!responseText?.trim()) {
      alert('Please enter a response');
      return;
    }

    await handleStatusUpdate(id, 'under_review', responseText);
    
    setOpenRespondBox((prev) => ({
      ...prev,
      [id]: false,
    }));
    setResponses((prev) => ({
      ...prev,
      [id]: '',
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' };
      case 'under_review': return { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' };
      case 'resolved': return { bg: '#d1fae5', color: '#065f46', border: '#6ec531' };
      case 'dismissed': return { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' };
      default: return { bg: '#f3f4f6', color: '#374151', border: '#9ca3af' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px',
        color: '#6b7280'
      }}>
        Loading reports...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px',
        textAlign: 'center',
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        borderRadius: '8px',
        margin: '20px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      {reports.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h3 style={{ fontSize: '18px', color: '#6b7280', margin: 0 }}>No reports found</h3>
          <p style={{ color: '#9ca3af', marginTop: '8px' }}>
            No reports have been submitted yet.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '20px' }}>
          {reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((report) => {
            const statusColors = getStatusColor(report.status);
            return (
              <div 
                key={report.id} 
                style={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  padding: '24px', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                }}
              >
                {/* Header with status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: statusColors.bg,
                        color: statusColors.color,
                        border: `1px solid ${statusColors.border}30`
                      }}>
                        {report.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>
                        {report.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    #{report.id.slice(-6)}
                  </div>
                </div>

                {/* Reporter info */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#6ec531',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}>
                      {report.reporter.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        {report.reporter.username || 'Anonymous'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {report.reporter.phone || report.reporter.email}
                      </div>
                    </div>
                  </div>
                  
                  {report.reportedUser && (
                    <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px' }}>
                      Reported User: <strong>{report.reportedUser.username}</strong>
                    </div>
                  )}
                </div>

                {/* Report content */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                  {report.reason}
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    lineHeight: '1.5',
                    backgroundColor: '#f9fafb',
                    padding: '12px',
                    borderRadius: '8px'
                  }}>
                    {report.details}
                  </p>
                  
                  {report.contactEmail && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                      Contact: {report.contactEmail}
                    </div>
                  )}
                </div>

                {/* Admin notes */}
                {report.adminNotes && (
                  <div style={{
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#0369a1', marginBottom: '4px' }}>
                      Admin Response:
                    </div>
                    <div style={{ fontSize: '13px', color: '#0c4a6e' }}>
                      {report.adminNotes}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'under_review')}
                        disabled={actionLoading}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          opacity: actionLoading ? 0.6 : 1
                        }}
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                        disabled={actionLoading}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: actionLoading ? 'not-allowed' : 'pointer',
                          opacity: actionLoading ? 0.6 : 1
                        }}
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  
                  {report.status === 'under_review' && (
                    <button
                      onClick={() => handleStatusUpdate(report.id, 'resolved')}
                      disabled={actionLoading}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: '#6ec531',
                        color: 'white',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: actionLoading ? 'not-allowed' : 'pointer',
                        opacity: actionLoading ? 0.6 : 1
                      }}
                    >
                      Mark Resolved
                    </button>
                  )}

                  <button
                    onClick={() => toggleRespondBox(report.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: openRespondBox[report.id] ? '#6b7280' : '#ec066a',
                      color: 'white',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    {openRespondBox[report.id] ? 'Cancel' : 'Add Note'}
                  </button>
                </div>

                {/* Response box */}
                {openRespondBox[report.id] && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <textarea
                      placeholder="Add admin notes or response..."
                      style={{ 
                        width: '100%', 
                        minHeight: '80px', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        border: 'none',
                        backgroundColor: '#f9fafb',
                        fontFamily: 'inherit', 
                        fontSize: '14px',
                        resize: 'vertical',
                        outline: 'none'
                      }}
                      value={responses[report.id] || ''}
                      onChange={(e) => handleResponseChange(report.id, e.target.value)}
                      onFocus={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                      onBlur={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    />
                    <button
                      style={{
                        alignSelf: 'flex-end',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: '#6ec531',
                        color: 'white',
                        border: 'none',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                      onClick={() => handleSendResponse(report.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Saving...' : 'Save Note'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DisputeManagement;
