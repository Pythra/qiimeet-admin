import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../env';

const UserDetail = ({ userId, onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`);
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
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

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatArray = (arr) => {
    if (!arr || arr.length === 0) return 'None';
    return arr.join(', ');
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading user details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <button
          onClick={onBack}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            marginBottom: 16
          }}
        >
          ← Back to Users
        </button>
        <div style={{ color: 'red' }}>{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: 24 }}>
        <button
          onClick={onBack}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            marginBottom: 16
          }}
        >
          ← Back to Users
        </button>
        <div>User not found</div>
      </div>
    );
  }

  const sectionStyle = {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 4
  };

  const valueStyle = {
    fontSize: '14px',
    color: '#1f2937',
    marginBottom: 12
  };

  const statusStyle = (status) => ({
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
    backgroundColor: status === 'Active' ? '#d1fae5' :
                    status === 'Pending' ? '#fef3c7' :
                    status === 'verified' ? '#d1fae5' :
                    status === 'rejected' ? '#fee2e2' : '#e5e7eb',
    color: status === 'Active' ? '#065f46' :
           status === 'Pending' ? '#92400e' :
           status === 'verified' ? '#065f46' :
           status === 'rejected' ? '#b91c1c' : '#4b5563'
  });

  return (
    <div style={{ padding: 24, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '8px 16px',
            cursor: 'pointer',
            marginBottom: 16
          }}
        >
          ← Back to Users
        </button>
        <h1 style={{ fontSize: 24, fontWeight: '700', color: '#1f2937', margin: 0 }}>
          User Details: {user.displayName}
        </h1>
      </div>

      {/* Modal for images */}
      {selectedImages.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
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
              borderRadius: 8,
              maxWidth: '95vw',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Images</h3>
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
                    border: '1px solid #ccc'
                  }}
                  onError={(e) => {
                    console.log('Image failed to load:', url);
                    e.target.style.display = 'none';
                  }}
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
                borderRadius: 6,
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        
        {/* Basic Information */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#1f2937' }}>
            Basic Information
          </h2>
          
          <div style={labelStyle}>Username</div>
          <div style={valueStyle}>{user.username || 'N/A'}</div>
          
          <div style={labelStyle}>Full Name</div>
          <div style={valueStyle}>
            {[user.firstname, user.middlename, user.lastname].filter(Boolean).join(' ') || 'N/A'}
          </div>
          
          <div style={labelStyle}>Phone Number</div>
          <div style={valueStyle}>{user.phoneNumber}</div>
          
          <div style={labelStyle}>Email</div>
          <div style={valueStyle}>{user.emailAddress}</div>
          
          <div style={labelStyle}>Gender</div>
          <div style={valueStyle}>{user.gender}</div>
          
          <div style={labelStyle}>Age</div>
          <div style={valueStyle}>{user.age}</div>
          
          <div style={labelStyle}>Location</div>
          <div style={valueStyle}>{user.location}</div>
          
          <div style={labelStyle}>Date of Birth</div>
          <div style={valueStyle}>{formatDate(user.dateOfBirth)}</div>
          
          <div style={labelStyle}>Account Status</div>
          <div style={valueStyle}>
            <span style={statusStyle(user.status)}>
              {user.status}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#1f2937' }}>
            Profile Details
          </h2>
          
          <div style={labelStyle}>Bio</div>
          <div style={valueStyle}>{user.bio || 'N/A'}</div>
          
          <div style={labelStyle}>Goal</div>
          <div style={valueStyle}>{user.goal || 'N/A'}</div>
          
          <div style={labelStyle}>Height</div>
          <div style={valueStyle}>{user.height || 'N/A'}</div>
          
          <div style={labelStyle}>Career</div>
          <div style={valueStyle}>{user.career || 'N/A'}</div>
          
          <div style={labelStyle}>Education</div>
          <div style={valueStyle}>{user.education || 'N/A'}</div>
          
          <div style={labelStyle}>Zodiac Sign</div>
          <div style={valueStyle}>{user.zodiac || 'N/A'}</div>
          
          <div style={labelStyle}>Religion</div>
          <div style={valueStyle}>{user.religon || 'N/A'}</div>
          
          <div style={labelStyle}>Personality</div>
          <div style={valueStyle}>{user.personality || 'N/A'}</div>
          
          <div style={labelStyle}>Kids</div>
          <div style={valueStyle}>{user.kids || 'N/A'}</div>
          
          <div style={labelStyle}>Interests</div>
          <div style={valueStyle}>{formatArray(user.interests)}</div>
          
          <div style={labelStyle}>Languages</div>
          <div style={valueStyle}>{formatArray(user.languages)}</div>
          
          <div style={labelStyle}>Lifestyle</div>
          <div style={valueStyle}>{formatArray(user.lifestyle)}</div>
        </div>

        {/* Account & Verification */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#1f2937' }}>
            Account & Verification
          </h2>
          
          <div style={labelStyle}>Verification Status</div>
          <div style={valueStyle}>
            <span style={statusStyle(user.verificationStatus)}>
              {user.verificationStatus}
            </span>
          </div>
          
          {user.verificationRejectionReason && (
            <>
              <div style={labelStyle}>Rejection Reason</div>
              <div style={valueStyle}>{user.verificationRejectionReason}</div>
            </>
          )}
          
          <div style={labelStyle}>Balance</div>
          <div style={valueStyle}>₦{user.balance || 0}</div>
          
          <div style={labelStyle}>Allowed Connections</div>
          <div style={valueStyle}>{user.allowedConnections || 0}</div>
          
          <div style={labelStyle}>Remaining Connections</div>
          <div style={valueStyle}>{user.remainingConnections || 0}</div>
          
          <div style={labelStyle}>Role</div>
          <div style={valueStyle}>{user.role || 'user'}</div>
          
          <div style={labelStyle}>Social Provider</div>
          <div style={valueStyle}>{user.socialProvider || 'N/A'}</div>
          
          <div style={labelStyle}>Created At</div>
          <div style={valueStyle}>{formatDate(user.createdAt)}</div>
          
          <div style={labelStyle}>Updated At</div>
          <div style={valueStyle}>{formatDate(user.updatedAt)}</div>
        </div>

        {/* Social Connections */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#1f2937' }}>
            Social Connections
          </h2>
          
          <div style={labelStyle}>Likes Given</div>
          <div style={valueStyle}>{user.likes?.length || 0}</div>
          
          <div style={labelStyle}>Dislikes Given</div>
          <div style={valueStyle}>{user.dislikes?.length || 0}</div>
          
          <div style={labelStyle}>Active Connections</div>
          <div style={valueStyle}>{user.connections?.length || 0}</div>
          
          <div style={labelStyle}>Incoming Requests</div>
          <div style={valueStyle}>{user.requesters?.length || 0}</div>
          
          <div style={labelStyle}>Outgoing Requests</div>
          <div style={valueStyle}>{user.requests?.length || 0}</div>
          
          <div style={labelStyle}>Blocked Users</div>
          <div style={valueStyle}>{user.blockedUsers?.length || 0}</div>
          
          <div style={labelStyle}>Past Connections</div>
          <div style={valueStyle}>{user.pastConnections?.length || 0}</div>
        </div>
      </div>

      {/* Profile Pictures */}
      {user.profilePictures && user.profilePictures.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#1f2937' }}>
            Profile Pictures
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {user.profilePictures.map((url, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <img
                  src={getImageUrl(url)}
                  alt={`Profile-${i}`}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedImages(user.profilePictures.map(getImageUrl))}
                  onError={(e) => {
                    console.log('Profile image failed to load:', url);
                    e.target.style.display = 'none';
                  }}
                />
                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: 4 }}>
                  Photo {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Identity Pictures */}
      {user.identityPictures && user.identityPictures.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={{ fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#1f2937' }}>
            Identity Documents
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {user.identityPictures.map((url, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <img
                  src={getImageUrl(url)}
                  alt={`ID-${i}`}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedImages(user.identityPictures.map(getImageUrl))}
                  onError={(e) => {
                    console.log('Identity image failed to load:', url);
                    e.target.style.display = 'none';
                  }}
                />
                <div style={{ fontSize: '10px', color: '#6b7280', marginTop: 4 }}>
                  {i === 0 ? 'ID Front' : i === 1 ? 'ID Back' : 'Document'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;



