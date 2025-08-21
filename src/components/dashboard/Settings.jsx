import React, { useState } from 'react';

const Settings = () => {
  const [formData, setFormData] = useState({
    adminName: 'John Admin',
    email: 'admin@qimeet.com',
    password: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    matchNotifications: true,
    theme: 'light',
    autoModeration: true,
    profileVerification: true
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings Saved:', formData);
  };

  const tabs = [
    { id: 'general', label: 'General Settings' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'app', label: 'App Management' }
  ];

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px' 
      }}> 
       </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* Sidebar Navigation */}
        <div style={{ 
          width: '250px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '16px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)' 
        }}>
          <nav>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#ec066a' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#4b5563',
                  textAlign: 'left',
                  cursor: 'pointer',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Personal Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Admin Name</label>
                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #d1d5db', 
                        fontSize: '14px' 
                      }}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #d1d5db', 
                        fontSize: '14px' 
                      }}
                      placeholder="admin@qimeet.com"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Theme Preference</label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      borderRadius: '6px', 
                      border: '1px solid #d1d5db', 
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Notification Preferences</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive important updates via email' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Get instant notifications on your device' },
                    { key: 'matchNotifications', label: 'New Match Alerts', desc: 'Be notified when users find matches' }
                  ].map((item) => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{item.label}</label>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{item.desc}</p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={formData[item.key]}
                          onChange={handleChange}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{ 
                          position: 'absolute', 
                          cursor: 'pointer', 
                          top: 0, 
                          left: 0, 
                          right: 0, 
                          bottom: 0, 
                          backgroundColor: formData[item.key] ? '#6ec531' : '#d1d5db', 
                          transition: '0.2s', 
                          borderRadius: '24px' 
                        }}></span>
                        <span style={{ 
                          position: 'absolute', 
                          height: '18px', 
                          width: '18px', 
                          left: formData[item.key] ? '22px' : '3px', 
                          bottom: '3px', 
                          backgroundColor: 'white', 
                          transition: '0.2s', 
                          borderRadius: '50%' 
                        }}></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Security Settings</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #d1d5db', 
                        fontSize: '14px' 
                      }}
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        padding: '10px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #d1d5db', 
                        fontSize: '14px' 
                      }}
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* App Settings */}
            {activeTab === 'app' && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>Dating App Management</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { key: 'autoModeration', label: 'Auto Moderation', desc: 'Automatically filter inappropriate content' },
                    { key: 'profileVerification', label: 'Profile Verification', desc: 'Require users to verify their profiles' }
                  ].map((item) => (
                    <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>{item.label}</label>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{item.desc}</p>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                        <input
                          type="checkbox"
                          name={item.key}
                          checked={formData[item.key]}
                          onChange={handleChange}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{ 
                          position: 'absolute', 
                          cursor: 'pointer', 
                          top: 0, 
                          left: 0, 
                          right: 0, 
                          bottom: 0, 
                          backgroundColor: formData[item.key] ? '#6ec531' : '#d1d5db', 
                          transition: '0.2s', 
                          borderRadius: '24px' 
                        }}></span>
                        <span style={{ 
                          position: 'absolute', 
                          height: '18px', 
                          width: '18px', 
                          left: formData[item.key] ? '22px' : '3px', 
                          bottom: '3px', 
                          backgroundColor: 'white', 
                          transition: '0.2s', 
                          borderRadius: '50%' 
                        }}></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#ec066a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 24px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  float: 'right'
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;