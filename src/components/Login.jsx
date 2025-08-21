import React, { useState } from 'react';
import { API_BASE_URL } from '../../env';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // First check if it's super admin
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        // Super admin login
        setTimeout(() => {
          setIsLoading(false);
          onLogin({ 
            username: credentials.username, 
            role: 'super_admin',
            permissions: {
              dashboard: true,
              users: true,
              fees: true,
              verification: true,
              admin: true,
              disputes: true,
              subscription: true,
              earnings: true,
              settings: true
            }
          });
        }, 1000);
        return;
      }

      // Check if it's a subadmin
      const response = await fetch(`${API_BASE_URL}/admin/sub-admins`);
      const data = await response.json();
      
      if (data.success && data.subAdmins) {
        const subAdmin = data.subAdmins.find(
          admin => admin.email === credentials.username || admin.displayName === credentials.username
        );

        if (subAdmin) {
          // For now, we'll use a simple password check
          // In production, you should implement proper password hashing
          if (subAdmin.password === credentials.password || credentials.password === 'subadmin123') {
            setIsLoading(false);
            onLogin({
              username: subAdmin.displayName || subAdmin.email,
              email: subAdmin.email,
              role: 'sub_admin',
              permissions: subAdmin.permissions || {},
              id: subAdmin.id
            });
            return;
          }
        }
      }

      // Invalid credentials
      setIsLoading(false);
      setError('Invalid credentials. Use admin/admin123 for super admin or your subadmin credentials.');
      
    } catch (err) {
      setIsLoading(false);
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        {/* Logo/Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#6ec531',
            borderRadius: '50%',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold'
          }}>
            Q
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Qiimeet Admin
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Sign in to your admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Username/Email
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter username or email"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6ec531'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6ec531'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '14px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isLoading ? '#9ca3af' : '#6ec531',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '16px'
            }}
            onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#5bb52a')}
            onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#6ec531')}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Test Credentials Hint */}
          <div style={{
            textAlign: 'center',
            padding: '16px',
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#0369a1'
          }}>
            <strong>Test Credentials:</strong><br />
            <strong>Super Admin:</strong><br />
            Username: <code>admin</code><br />
            Password: <code>admin123</code><br /><br />
            <strong>Subadmin:</strong><br />
            Use your subadmin email/username<br />
            Password: <code>subadmin123</code>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
