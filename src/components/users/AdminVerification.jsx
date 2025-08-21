import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../../env';

const API_URL = `${API_BASE_URL}/admin/verifications/pending`;
const CLOUDFRONT_URL = 'https://d11n4tndq0o4wh.cloudfront.net';

const AdminVerification = () => {
  // Get image URL with proper CloudFront URL handling (consistent with mobile app)
  const getImageUrl = (imageUrl) => {
    console.log('Getting image URL for:', imageUrl);
    
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.log('No image URL provided');
      return null;
    }

    const path = imageUrl.trim();

    // Skip local URIs from mobile (not accessible from admin web)
    if (path.startsWith('file:') || path.startsWith('content:') || path.startsWith('data:')) {
      console.log('Skipping local URI for admin:', path);
      return null;
    }

    // Relative uploads path → CloudFront
    if (path.startsWith('/uploads/')) {
      const fullUrl = `${CLOUDFRONT_URL}${path}`;
      console.log('Constructed CloudFront URL for relative path:', fullUrl);
      return fullUrl;
    }

    // Full HTTP URL
    if (path.startsWith('http')) {
      try {
        const url = new URL(path);
        // Convert S3 bucket URL to CloudFront path
        if (url.hostname.includes('s3.amazonaws.com') || url.hostname.includes('qiimeetbucket')) {
          const key = url.pathname.replace(/^\//, '');
          const cf = `${CLOUDFRONT_URL}/${key}`;
          console.log('Converted S3 URL to CloudFront:', cf);
          return cf;
        }
        console.log('Using existing full URL:', path);
        return path;
      } catch (e) {
        console.log('Invalid URL, skipping:', path);
        return null;
      }
    }

    // Plain filename → CloudFront images path
    const fullUrl = `${CLOUDFRONT_URL}/uploads/images/${path}`;
    console.log('Constructed CloudFront URL for filename:', fullUrl);
    return fullUrl;
  };
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    const fetchVerificationUsers = async () => {
      setLoading(true);
      try {
        console.log('[AdminVerification] Fetching pending verifications from:', API_URL);
        
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('[AdminVerification] API Response:', result);

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch verification data');
        }

        const data = result.users || [];

        const usersArr = data.map(user => ({
          _id: user.id || user._id,
          username: user.username || user.name || 'N/A',
          name: user.name || `${user.firstname || ''} ${user.middlename || ''} ${user.lastname || ''}`.trim() || '',
          firstname: user.firstname || '',
          middlename: user.middlename || '',
          lastname: user.lastname || '',
          verificationStatus: user.verificationStatus || 'pending',
          profilePictures: Array.isArray(user.profilePictures) ? user.profilePictures : [],
          identityPictures: Array.isArray(user.identityPictures) ? user.identityPictures : [],
          phone: user.phone || '',
          gender: user.gender || '',
          age: user.age || '',
          location: user.location || '',
          goal: user.goal || '',
          createdAt: user.createdAt || ''
        }));

        setDebugInfo({
          rawDataType: typeof data,
          rawDataIsArray: Array.isArray(data),
          rawDataLength: Array.isArray(data) ? data.length : 'N/A',
          processedUsersCount: usersArr.length,
          firstUser: usersArr[0] || null
        });

        setUsers(usersArr);
        setError(usersArr.length === 0 ? 'No users found' : null);
      } catch (err) {
        setError(`Failed to load users: ${err.message}`);
        setDebugInfo({ error: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verifications/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(users => users.filter(u => u._id !== userId));
        console.log('User approved successfully:', userId);
      } else {
        console.error('Failed to approve user:', result.error);
        setError('Failed to approve user');
      }
    } catch (err) {
      console.error('Error approving user:', err);
      setError('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/verifications/${userId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'Admin rejection'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setUsers(users => users.filter(u => u._id !== userId));
        console.log('User rejected successfully:', userId);
      } else {
        console.error('Failed to reject user:', result.error);
        setError('Failed to reject user');
      }
    } catch (err) {
      console.error('Error rejecting user:', err);
      setError('Failed to reject user');
    }
  };

  const tdStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px',
    color: '#1f2937'
  };

  const statusStyle = (status) => ({
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize',
    backgroundColor: status === 'verified' ? '#d1fae5' :
                    status === 'pending' ? '#fef3c7' :
                    status === 'rejected' ? '#fee2e2' : '#e5e7eb',
    color: status === 'verified' ? '#065f46' :
           status === 'pending' ? '#92400e' :
           status === 'rejected' ? '#b91c1c' : '#4b5563'
  });

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading users...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>
        <pre style={{ background: '#f3f4f6', padding: 12, borderRadius: 8 }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Modal for multiple images */}
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
            <h3 style={{ marginTop: 0 }}>Identity Documents</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {selectedImages.map((url, i) => {
                // Calculate the label based on total images
                // First 2 are always ID Front/Back, then comes Selfie
                let label;
                if (i === 0) label = 'ID Front';
                else if (i === 1) label = 'ID Back';
                else label = 'Selfie';

                return (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <img
                      src={url}
                      alt={label}
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        maxHeight: '60vh',
                        objectFit: 'contain',
                        borderRadius: 8,
                        border: '1px solid #ccc'
                      }}
                      onError={(e) => {
                        console.log('Modal image failed to load:', url);
                        e.target.style.display = 'none';
                      }}
                    />
                    <p style={{ 
                      margin: '8px 0 0 0', 
                      fontSize: '12px', 
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      {label}
                    </p>
                  </div>
                );
              })}
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

      <div style={{ backgroundColor: 'white', padding: 24, borderRadius: 8 }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>User Verification ({users.length})</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={tdStyle}>Username</th>
              <th style={tdStyle}>Identity Documents</th>
              <th style={tdStyle}>Status</th>
              <th style={tdStyle}>Profile</th>
              <th style={{ ...tdStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb' }}>
                <td style={tdStyle}>
                  <div>{user.username}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{user.location}</div>
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {user.identityPictures.map((url, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <img
                          src={getImageUrl(url)}
                          alt={`ID-${i}`}
                          style={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 6,
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer'
                          }}
                          onClick={() => setSelectedImages(user.identityPictures.map(getImageUrl).filter(Boolean))}
                          onError={(e) => {
                            console.log('Identity image failed to load:', url);
                            e.target.style.display = 'none';
                          }}
                        />
                        <div style={{ 
                          fontSize: '10px', 
                          color: '#6b7280', 
                          marginTop: '2px',
                          fontWeight: '500'
                        }}>
                          {i === 0 ? 'Front' : i === 1 ? 'Back' : 'Selfie'}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={statusStyle(user.verificationStatus)}>
                    {user.verificationStatus}
                  </span>
                </td>
                <td style={tdStyle}>
                  {user.profilePictures && user.profilePictures.map((url, i) => {
                    const src = getImageUrl(url);
                    if (!src) return null;
                    return (
                      <img
                        key={i}
                        src={src}
                        alt="Profile"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid #e5e7eb',
                          marginRight: i < user.profilePictures.length - 1 ? 4 : 0
                        }}
                        onError={(e) => {
                          console.log('Profile image failed to load:', url);
                          e.target.style.display = 'none';
                        }}
                      />
                    );
                  })}
                  {(!user.profilePictures || user.profilePictures.length === 0) && (
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>No profile pics</span>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <button
                    onClick={() => handleApprove(user._id)}
                    style={{
                      background: '#6ec531',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      marginRight: 8,
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(user._id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      cursor: 'pointer'
                    }}
                  >
                    ✕ Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVerification;
