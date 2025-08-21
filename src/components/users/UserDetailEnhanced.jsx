import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../env';
import { 
  User, 
  FileText, 
  Shield, 
  Users, 
  Camera, 
  CreditCard, 
  DollarSign, 
  UserX, 
  UserCheck, 
  XCircle,
  Pause
} from 'react-feather';

const UserDetailEnhanced = ({ userId, onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showEditBalance, setShowEditBalance] = useState(false);
  const [newBalance, setNewBalance] = useState('');
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // App theme colors
  const primaryColor = '#6ec531';
  const secondaryColor = '#ec066a';

  // Get image URL with proper CloudFront URL handling
  const getImageUrl = (imageUrl) => {
    if (imageUrl) {
      const cloudFrontUrl = 'https://d11n4tndq0o4wh.cloudfront.net';
      
      if (imageUrl.startsWith('/uploads/')) {
        return `${cloudFrontUrl}${imageUrl}`;
      }
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      if (!imageUrl.startsWith('/')) {
        return `${cloudFrontUrl}/uploads/images/${imageUrl}`;
      }
      return imageUrl;
    }
    return null;
  };

  // Get profile image URL with CloudFront URL (consistent with mobile app)
  const getProfileImage = (user) => {
    console.log('Getting profile image for user:', user.displayName, 'profilePicture:', user.profilePicture, 'profilePictures:', user.profilePictures);
    
    // Check for profilePicture (singular) first
    if (user.profilePicture) {
      const cloudFrontUrl = 'https://d11n4tndq0o4wh.cloudfront.net';
      
      // If it's a relative path, construct CloudFront URL
      if (user.profilePicture.startsWith('/uploads/')) {
        const fullUrl = `${cloudFrontUrl}${user.profilePicture}`;
        console.log('Constructed CloudFront URL for relative path:', fullUrl);
        return fullUrl;
      }
      // If it's already a full URL, return as is
      if (user.profilePicture.startsWith('http')) {
        console.log('Using existing full URL:', user.profilePicture);
        return user.profilePicture;
      }
      // If it's just a filename, construct the full CloudFront path
      if (!user.profilePicture.startsWith('/')) {
        const fullUrl = `${cloudFrontUrl}/uploads/images/${user.profilePicture}`;
        console.log('Constructed CloudFront URL for filename:', fullUrl);
        return fullUrl;
      }
      console.log('Using profile picture as is:', user.profilePicture);
      return user.profilePicture;
    }
    
    // Check for profilePictures (plural) as fallback
    if (user.profilePictures && user.profilePictures.length > 0) {
      return getImageUrl(user.profilePictures[0]);
    }
    
    console.log('No profile picture found, using default image for user:', user.displayName);
    return null;
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        setNewBalance(data.user.balance || 0);
      } else {
        setError('Failed to fetch user details');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleUpdateBalance = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/balance`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: parseFloat(newBalance) })
      });

      const data = await response.json();
      if (data.success) {
        setUser(prev => ({ ...prev, balance: parseFloat(newBalance) }));
        setShowEditBalance(false);
        alert('Balance updated successfully');
      } else {
        alert('Failed to update balance');
      }
    } catch (err) {
      alert('Error updating balance');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUserAction = async (action, reason = '') => {
    try {
      setActionLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/${action}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });

      const data = await response.json();
      if (data.success) {
        fetchUser(); // Refresh user data
        setShowBanModal(false);
        setBanReason('');
        alert(`User ${action} successful`);
      } else {
        alert(`Failed to ${action} user`);
      }
    } catch (err) {
      alert(`Error ${action}ing user`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatArray = (arr) => {
    if (!arr || arr.length === 0) return 'None';
    return arr.join(', ');
  };

  const getVerificationStatusInfo = (status) => {
    switch (status) {
      case 'verified':
      case 'true':
        return { text: 'Verified', color: primaryColor, bgColor: `${primaryColor}20` };
      case 'pending':
        return { text: 'Pending', color: '#f59e0b', bgColor: '#fef3c720' };
      case 'rejected':
        return { text: 'Rejected', color: '#ef4444', bgColor: '#fee2e220' };
      case 'false':
        return { text: 'Not Verified', color: '#6b7280', bgColor: '#e5e7eb20' };
      default:
        return { text: status || 'Unknown', color: '#6b7280', bgColor: '#e5e7eb20' };
    }
  };

  const getUserStatusInfo = (user) => {
    if (user.role === 'banned') return { text: 'Banned', color: '#dc2626', bgColor: '#fee2e220' };
    if (user.role === 'suspended') return { text: 'Suspended', color: '#d97706', bgColor: '#fef3c720' };
    if (user.verificationStatus === 'verified' || user.verificationStatus === 'true') {
      return { text: 'Active', color: primaryColor, bgColor: `${primaryColor}20` };
    }
    return { text: 'Inactive', color: '#6b7280', bgColor: '#e5e7eb20' };
  };

  if (loading) {
    return (
      <div style={{ 
        padding: 40, 
        textAlign: 'center',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          padding: '20px 40px',
          borderRadius: 12,
          background: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          fontSize: '16px', 
          color: '#6b7280' 
        }}>
          Loading user details...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{ padding: 24, background: '#f9fafb', minHeight: '100vh' }}>
        <button
          onClick={onBack}
          style={{
            background: 'white',
            border: `2px solid ${primaryColor}`,
            color: primaryColor,
            borderRadius: 8,
            padding: '12px 24px',
            cursor: 'pointer',
            marginBottom: 20,
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          ← Back to Users
        </button>
        <div style={{
          background: 'white',
          padding: 40,
          borderRadius: 12,
          textAlign: 'center',
          color: '#ef4444',
          fontSize: '16px'
        }}>
          {error || 'User not found'}
        </div>
      </div>
    );
  }

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 28,
    marginBottom: 24,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.04)',
    transition: 'all 0.2s ease'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8
  };

  const valueStyle = {
    fontSize: '14px',
    color: '#1f2937',
    marginBottom: 20,
    fontWeight: '500',
    lineHeight: '1.4'
  };

  const statusBadge = (statusInfo) => ({
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: 20,
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: statusInfo.bgColor,
    color: statusInfo.color,
    border: `1px solid ${statusInfo.color}30`
  });

  const actionButtonStyle = (color, isSecondary = false) => ({
    background: isSecondary ? 'white' : color,
    color: isSecondary ? color : 'white',
    border: `2px solid ${color}`,
    borderRadius: 8,
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    marginRight: 8,
    marginBottom: 8,
    transition: 'all 0.2s ease'
  });

  const verificationStatus = getVerificationStatusInfo(user.verificationStatus);
  const userStatus = getUserStatusInfo(user);

  return (
    <div style={{ padding: 24, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            background: 'white',
            border: `2px solid ${primaryColor}`,
            color: primaryColor,
            borderRadius: 8,
            padding: '12px 24px',
            cursor: 'pointer',
            marginBottom: 16,
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          ← Back to Users
        </button>
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Profile Picture - Left Side */}
            {getProfileImage(user) ? (
              <img
                src={getProfileImage(user)}
                alt="Profile"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `4px solid ${primaryColor}`,
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                  flexShrink: 0
                }}
                onError={(e) => e.target.style.display = 'none'}
              />
            ) : (
              <div style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: '#f3f4f6',
                border: `4px solid ${primaryColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={40} color={primaryColor} />
              </div>
            )}
            
            {/* User Info - Right Side */}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 32, fontWeight: '700', color: '#1f2937', margin: 0, marginBottom: 12 }}>
                {user.displayName}
              </h1>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={statusBadge(userStatus)}>{userStatus.text}</span>
                <span style={statusBadge(verificationStatus)}>{verificationStatus.text}</span>
                <span style={{ 
                  color: '#6b7280', 
                  fontSize: '14px',
                  background: '#f3f4f6',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontWeight: '500'
                }}>
                  ID: {user.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div style={cardStyle}>
        <h2 style={{ 
          fontSize: 20, 
          fontWeight: '700', 
          marginBottom: 20, 
          color: '#1f2937', 
          display: 'flex', 
          alignItems: 'center',
          borderBottom: `2px solid ${primaryColor}`,
          paddingBottom: 12
        }}>
          <Shield size={20} style={{ marginRight: 8, color: primaryColor }} /> Admin Actions
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button
            onClick={() => setShowEditBalance(true)}
            style={actionButtonStyle(primaryColor)}
            disabled={actionLoading}
          >
            <DollarSign size={16} style={{ marginRight: 6 }} /> Edit Balance
          </button>
          
          {user.role !== 'banned' && (
            <button
              onClick={() => setShowBanModal(true)}
              style={actionButtonStyle('#dc2626')}
              disabled={actionLoading}
            >
              <UserX size={16} style={{ marginRight: 6 }} /> Ban User
            </button>
          )}
          
          {user.role !== 'suspended' && user.role !== 'banned' && (
            <button
              onClick={() => handleUserAction('suspend')}
              style={actionButtonStyle('#d97706')}
              disabled={actionLoading}
            >
              <Pause size={16} style={{ marginRight: 6 }} /> Suspend User
            </button>
          )}
          
          {(user.role === 'suspended' || user.role === 'banned') && (
            <button
              onClick={() => handleUserAction('unban')}
              style={actionButtonStyle(primaryColor)}
              disabled={actionLoading}
            >
              <UserCheck size={16} style={{ marginRight: 6 }} /> Restore User
            </button>
          )}
          
          {(user.verificationStatus === 'verified' || user.verificationStatus === 'true') && (
            <button
              onClick={() => handleUserAction('unverify')}
              style={actionButtonStyle('#f59e0b')}
              disabled={actionLoading}
            >
              <XCircle size={16} style={{ marginRight: 6 }} /> Unverify
            </button>
          )}
          
          <button
            onClick={() => handleUserAction('reset-password')}
            style={actionButtonStyle(secondaryColor, true)}
            disabled={actionLoading}
          >
            <Shield size={16} style={{ marginRight: 6 }} /> Reset Password
          </button>
        </div>
      </div>

      {/* Modals */}
      {selectedImages.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedImages([])}
        >
          <div
            style={{
              background: '#fff',
              padding: 20,
              borderRadius: 16,
              maxWidth: '95vw',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, color: '#1f2937' }}>Images</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {selectedImages.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Image-${i}`}
                  style={{
                    maxWidth: '300px',
                    height: 'auto',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb'
                  }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              ))}
            </div>
            <button
              onClick={() => setSelectedImages([])}
              style={{
                marginTop: 16,
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showEditBalance && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div style={{
            background: 'white',
            padding: 30,
            borderRadius: 16,
            minWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: 0, marginBottom: 20, color: '#1f2937' }}>Edit User Balance</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>New Balance (₦)</label>
              <input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleUpdateBalance}
                disabled={actionLoading}
                style={{
                  ...actionButtonStyle(primaryColor),
                  marginRight: 0,
                  marginBottom: 0,
                  flex: 1
                }}
              >
                {actionLoading ? 'Updating...' : 'Update Balance'}
              </button>
              <button
                onClick={() => setShowEditBalance(false)}
                style={{
                  ...actionButtonStyle('#6b7280', true),
                  marginRight: 0,
                  marginBottom: 0,
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showBanModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
        >
          <div style={{
            background: 'white',
            padding: 30,
            borderRadius: 16,
            minWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: 0, marginBottom: 20, color: '#dc2626' }}>Ban User</h3>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Ban Reason</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter reason for banning this user..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: '14px',
                  outline: 'none',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => handleUserAction('ban', banReason)}
                disabled={actionLoading}
                style={{
                  ...actionButtonStyle('#dc2626'),
                  marginRight: 0,
                  marginBottom: 0,
                  flex: 1
                }}
              >
                {actionLoading ? 'Banning...' : 'Ban User'}
              </button>
              <button
                onClick={() => setShowBanModal(false)}
                style={{
                  ...actionButtonStyle('#6b7280', true),
                  marginRight: 0,
                  marginBottom: 0,
                  flex: 1
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
        
        {/* Basic Information */}
        <div style={cardStyle}>
          <h2 style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            marginBottom: 20, 
            color: '#1f2937', 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `2px solid ${primaryColor}`,
            paddingBottom: 12
          }}>
            <User size={18} style={{ marginRight: 8, color: primaryColor }} /> Basic Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={labelStyle}>Username</div>
              <div style={valueStyle}>{user.username || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Full Name</div>
              <div style={valueStyle}>
                {[user.firstname, user.middlename, user.lastname].filter(Boolean).join(' ') || 'N/A'}
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Phone Number</div>
              <div style={valueStyle}>{user.phoneNumber}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Email</div>
              <div style={valueStyle}>{user.emailAddress}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Gender</div>
              <div style={valueStyle}>{user.gender}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Age</div>
              <div style={valueStyle}>{user.age}</div>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Location</div>
              <div style={valueStyle}>{user.location}</div>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Date of Birth</div>
              <div style={valueStyle}>{formatDate(user.dateOfBirth)}</div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div style={cardStyle}>
          <h2 style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            marginBottom: 20, 
            color: '#1f2937', 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `2px solid ${secondaryColor}`,
            paddingBottom: 12
          }}>
            <FileText size={18} style={{ marginRight: 8, color: secondaryColor }} /> Profile Details
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={labelStyle}>Bio</div>
              <div style={valueStyle}>{user.bio || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Goal</div>
              <div style={valueStyle}>{user.goal || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Height</div>
              <div style={valueStyle}>{user.height || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Career</div>
              <div style={valueStyle}>{user.career || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Education</div>
              <div style={valueStyle}>{user.education || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Zodiac Sign</div>
              <div style={valueStyle}>{user.zodiac || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Religion</div>
              <div style={valueStyle}>{user.religon || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Personality</div>
              <div style={valueStyle}>{user.personality || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Kids</div>
              <div style={valueStyle}>{user.kids || 'N/A'}</div>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Interests</div>
              <div style={valueStyle}>{formatArray(user.interests)}</div>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Languages</div>
              <div style={valueStyle}>{formatArray(user.languages)}</div>
            </div>
            
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Lifestyle</div>
              <div style={valueStyle}>{formatArray(user.lifestyle)}</div>
            </div>
          </div>
        </div>

        {/* Account & Verification */}
        <div style={cardStyle}>
          <h2 style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            marginBottom: 20, 
            color: '#1f2937', 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `2px solid ${primaryColor}`,
            paddingBottom: 12
          }}>
            <Shield size={18} style={{ marginRight: 8, color: primaryColor }} /> Account & Verification
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={labelStyle}>Account Status</div>
              <div style={valueStyle}>
                <span style={statusBadge(userStatus)}>{userStatus.text}</span>
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Verification Status</div>
              <div style={valueStyle}>
                <span style={statusBadge(verificationStatus)}>{verificationStatus.text}</span>
              </div>
            </div>
            
            {user.verificationRejectionReason && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={labelStyle}>Rejection Reason</div>
                <div style={valueStyle}>{user.verificationRejectionReason}</div>
              </div>
            )}
            
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={labelStyle}>Balance</div>
              <div style={{ ...valueStyle, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '18px', fontWeight: '700', color: primaryColor }}>₦{user.balance || 0}</span>
                <button
                  onClick={() => setShowEditBalance(true)}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${primaryColor}`,
                    color: primaryColor,
                    borderRadius: 4,
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Connections</div>
              <div style={valueStyle}>
                {user.allowedConnections || 0} allowed, {user.remainingConnections || 0} remaining
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Role</div>
              <div style={valueStyle}>{user.role || 'user'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Social Provider</div>
              <div style={valueStyle}>{user.socialProvider || 'N/A'}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Member Since</div>
              <div style={valueStyle}>{formatDate(user.createdAt)}</div>
            </div>
            
            <div>
              <div style={labelStyle}>Last Updated</div>
              <div style={valueStyle}>{formatDate(user.updatedAt)}</div>
            </div>
          </div>
        </div>

        {/* Social Connections */}
        <div style={cardStyle}>
          <h2 style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            marginBottom: 20, 
            color: '#1f2937', 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `2px solid ${secondaryColor}`,
            paddingBottom: 12
          }}>
            <Users size={18} style={{ marginRight: 8, color: secondaryColor }} /> Social Activity
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={labelStyle}>Likes Given</div>
              <div style={{ ...valueStyle, fontSize: '20px', fontWeight: '700', color: primaryColor }}>
                {user.likes?.length || 0}
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Dislikes Given</div>
              <div style={{ ...valueStyle, fontSize: '20px', fontWeight: '700', color: '#ef4444' }}>
                {user.dislikes?.length || 0}
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Active Connections</div>
              <div style={{ ...valueStyle, fontSize: '20px', fontWeight: '700', color: secondaryColor }}>
                {user.connections?.length || 0}
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Incoming Requests</div>
              <div style={{ ...valueStyle, fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>
                {user.requesters?.length || 0}
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Outgoing Requests</div>
              <div style={{ ...valueStyle, fontSize: '20px', fontWeight: '700', color: '#8b5cf6' }}>
                {user.requests?.length || 0}
              </div>
            </div>
            
            <div>
              <div style={labelStyle}>Blocked Users</div>
              <div style={{ ...valueStyle, fontSize: '20px', fontWeight: '700', color: '#6b7280' }}>
                {user.blockedUsers?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Pictures */}
      {user.profilePictures && user.profilePictures.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            marginBottom: 20, 
            color: '#1f2937', 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `2px solid ${primaryColor}`,
            paddingBottom: 12
          }}>
            <Camera size={18} style={{ marginRight: 8, color: primaryColor }} /> Profile Pictures ({user.profilePictures.length})
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {user.profilePictures.map((url, i) => {
              const imageUrl = getImageUrl(url);
              if (!imageUrl) return null;
              
              return (
                <div key={i} style={{ textAlign: 'center' }}>
                  <img
                    src={imageUrl}
                    alt={`Profile-${i}`}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 12,
                      border: `2px solid ${primaryColor}30`,
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onClick={() => setSelectedImages(user.profilePictures.map(getImageUrl).filter(Boolean))}
                    onError={(e) => e.target.style.display = 'none'}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: 6, fontWeight: '500' }}>
                    Photo {i + 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Identity Pictures */}
      {user.identityPictures && user.identityPictures.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            marginBottom: 20, 
            color: '#1f2937', 
            display: 'flex', 
            alignItems: 'center',
            borderBottom: `2px solid ${secondaryColor}`,
            paddingBottom: 12
          }}>
            <CreditCard size={18} style={{ marginRight: 8, color: secondaryColor }} /> Identity Documents ({user.identityPictures.length})
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {user.identityPictures.map((url, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <img
                  src={getImageUrl(url)}
                  alt={`ID-${i}`}
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: `2px solid ${secondaryColor}30`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={() => setSelectedImages(user.identityPictures.map(getImageUrl))}
                  onError={(e) => e.target.style.display = 'none'}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: 6, fontWeight: '500' }}>
                  {i === 0 ? 'ID Front' : i === 1 ? 'ID Back' : 'Selfie'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailEnhanced;
