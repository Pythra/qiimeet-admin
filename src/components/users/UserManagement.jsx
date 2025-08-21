import React, { useState, useEffect } from 'react';
import recent from '../../assets/images/recent.png';
import searchIcon from '../../assets/images/searchicon.png';
import { API_BASE_URL } from '../../../env';
import UserDetailEnhanced from './UserDetailEnhanced';

const modelImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23f3f4f6'/%3E%3Ccircle cx='16' cy='12' r='5' fill='%236b7280'/%3E%3Cpath d='M7 26c0-5 4-9 9-9s9 4 9 9' fill='%236b7280'/%3E%3C/svg%3E";

// Option 1: Named function with default export
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched users data:', data.users);
        console.log('Sample user profile pictures:', data.users.map(u => ({ 
          id: u.id, 
          username: u.displayName, 
          profilePicture: u.profilePicture 
        })));
        setUsers(data.users);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm)
  );

  // Get profile image URL with CloudFront URL (consistent with mobile app)
  const getProfileImage = (user) => {
    console.log('Getting profile image for user:', user.displayName, 'profilePicture:', user.profilePicture);
    
    if (user.profilePicture) {
      // Use CloudFront URL for better performance and consistency with mobile app
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
    console.log('No profile picture, using default image for user:', user.displayName);
    return modelImage;
  };

  // Show user detail page if a user is selected
  if (selectedUserId) {
    return (
      <UserDetailEnhanced 
        userId={selectedUserId} 
        onBack={() => setSelectedUserId(null)} 
      />
    );
  }

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
          Loading users...
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
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Search and Filter Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <input
          type="text"
          placeholder="Search User"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '6px 16px 6px 60px', 
            borderRadius: '90px',
            width: '633px',height: '56px',
            fontSize: '14px',
            backgroundColor: '#fff',
            border: '1px solid rgb(255, 255, 255)',
            backgroundImage: `url(${searchIcon})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '24px center',
            backgroundSize: '20px'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>View by</span>
          <div style={{
            backgroundColor: '#fff',
            color: 'black',
            borderRadius: '8px',
            padding: '6px 0px',
            paddingLeft: '16px',
            fontSize: '13px',
            cursor: 'pointer',
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Most Recent
            <img src={recent} alt="Recent" style={{ width: '56px', height: '56px', }} />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={thStyle}>Profile Picture</th>
              <th style={thStyle}>Display Name</th>
              <th style={thStyle}>Phone Number</th>
              <th style={thStyle}>Email Address</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" style={{
                  ...tdStyle,
                  textAlign: 'center',
                  color: '#6b7280',
                  padding: '40px 16px'
                }}>
                  {searchTerm ? 'No users found matching your search' : 'No users found'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id} style={{ 
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? 'rgba(18, 18, 18, 0.03)' : 'transparent'
                }}>
                  <td style={tdStyle}>
                    <img 
                      src={getProfileImage(user)} 
                      alt="Profile" 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.log('Profile image failed to load for user:', user.id, 'image:', user.profilePicture);
                        e.target.src = modelImage;
                      }}
                    />
                  </td>
                  <td style={tdStyle}>{user.displayName}</td>
                  <td style={tdStyle}>{user.phoneNumber}</td>
                  <td style={tdStyle}>{user.emailAddress}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: user.status === 'Active' ? '#6ec53120' : '#f59e0b20',
                      color: user.status === 'Active' ? '#6ec531' : '#f59e0b',
                      border: `1px solid ${user.status === 'Active' ? '#6ec531' : '#f59e0b'}30`,
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => setSelectedUserId(user.id)}
                      style={{
                        background: '#6ec531',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(110, 197, 49, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                      onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;

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
