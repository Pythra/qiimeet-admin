import React, { useState, useEffect } from 'react';
import recent from '../../assets/images/recent.png';
import searchIcon from '../../assets/images/searchicon.png';
import { API_BASE_URL } from '../../../env';

const modelImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23f3f4f6'/%3E%3Ccircle cx='16' cy='12' r='5' fill='%236b7280'/%3E%3Cpath d='M7 26c0-5 4-9 9-9s9 4 9 9' fill='%236b7280'/%3E%3C/svg%3E";

const AdminManagement = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    displayName: '',
    permissions: {
      userManagement: false,
      feesManagement: false,
      verification: false,
      disputeManagement: false,
      subscriptionPlans: false,
      earnings: false
    }
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Fetch sub-admin users from backend
  const fetchSubAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/sub-admins`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched sub-admins data:', data.subAdmins);
        setSubAdmins(data.subAdmins || []);
      } else {
        setError('Failed to fetch sub-admin users');
      }
    } catch (err) {
      console.error('Error fetching sub-admin users:', err);
      setError('Failed to fetch sub-admin users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  // Filter sub-admins based on search term
  const filteredSubAdmins = subAdmins.filter(subAdmin => 
    subAdmin.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subAdmin.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreateForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle permission changes
  const handlePermissionChange = (permission) => {
    setCreateForm(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  // Create new sub-admin
  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/admin/sub-admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm)
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedPassword(data.generatedPassword);
        setShowPasswordModal(true);
        setShowCreateModal(false);
        setCreateForm({
          email: '',
          displayName: '',
          permissions: {
            userManagement: false,
            feesManagement: false,
            verification: false,
            disputeManagement: false,
            subscriptionPlans: false,
            earnings: false
          }
        });
        fetchSubAdmins(); // Refresh the list
      } else {
        setError(data.error || 'Failed to create sub-admin');
      }
    } catch (err) {
      console.error('Error creating sub-admin:', err);
      setError('Failed to create sub-admin');
    }
  };

  // Reset password for sub-admin
  const handleResetPassword = async (subAdminId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/sub-admins/${subAdminId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedPassword(data.newPassword);
        setShowPasswordModal(true);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to reset password');
    }
  };

  // Delete sub-admin
  const handleDeleteSubAdmin = async (subAdminId) => {
    if (!window.confirm('Are you sure you want to delete this sub-admin?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/sub-admins/${subAdminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        fetchSubAdmins(); // Refresh the list
      } else {
        setError(data.error || 'Failed to delete sub-admin');
      }
    } catch (err) {
      console.error('Error deleting sub-admin:', err);
      setError('Failed to delete sub-admin');
    }
  };



  if (loading) {
    return (
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '16px',
          color: '#6b7280'
        }}>
          Loading sub-admins...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '16px',
          color: '#ef4444'
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '24px' }}>
      
      {/* Create Sub-Admin Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '24px'
      }}>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            backgroundColor: '#ec066a',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span>
          Create Sub-Admin
        </button>
      </div>

      {/* Sub-Admins Section */}
      <div>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>Display Name</th>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>Email</th>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>Permissions</th>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>Status</th>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>Created</th>
                <th style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subAdmins.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{
                    padding: '40px 16px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    No sub-admins found
                  </td>
                </tr>
              ) : (
                subAdmins.map((subAdmin, index) => (
                  <tr key={subAdmin.id} style={{ 
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white'
                  }}>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px'
                    }}>{subAdmin.displayName}</td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px'
                    }}>{subAdmin.email}</td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px'
                    }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {Object.entries(subAdmin.permissions).map(([key, value]) => (
                          value && (
                            <span key={key} style={{
                              padding: '2px 6px',
                              backgroundColor: '#E5E7EB',
                              color: '#374151',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </span>
                          )
                        ))}
                      </div>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: subAdmin.status === 'active' ? '#10b981' : '#f59e0b',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {subAdmin.status}
                      </span>
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px'
                    }}>
                      {new Date(subAdmin.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{
                      padding: '12px 16px',
                      fontSize: '14px'
                    }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleResetPassword(subAdmin.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Reset Password
                        </button>
                        <button
                          onClick={() => handleDeleteSubAdmin(subAdmin.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sub-Admin Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '500px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Create Sub-Admin
            </h3>
            
            <form onSubmit={handleCreateSubAdmin}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={createForm.displayName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={createForm.email}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Permissions
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {Object.keys(createForm.permissions).map(permission => (
                    <div key={permission} style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="checkbox"
                        id={permission}
                        checked={createForm.permissions[permission]}
                        onChange={() => handlePermissionChange(permission)}
                        style={{ marginRight: '8px' }}
                      />
                      <label htmlFor={permission} style={{ fontSize: '14px', color: '#374151' }}>
                        {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ec066a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Create Sub-Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Password Modal */}
      {showPasswordModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Generated Password
            </h3>
            
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '24px'
            }}>
              Please copy and securely share this password with the new sub-admin. They will be required to change it on first login.
            </p>
            
            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '24px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#111827',
              wordBreak: 'break-all'
            }}>
              {generatedPassword}
            </div>
            
            <button
              onClick={copyToClipboard}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Copy Password
            </button>
            <button
              onClick={() => setShowPasswordModal(false)}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;

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