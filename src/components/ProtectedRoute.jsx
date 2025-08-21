import React from 'react';
import { usePermissions } from '../contexts/PermissionsContext';

const ProtectedRoute = ({ tabId, children, fallback = null }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(tabId)) {
    return fallback || (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        margin: '24px'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '8px',
            color: '#374151'
          }}>
            Access Denied
          </h3>
          <p style={{
            fontSize: '16px',
            margin: 0
          }}>
            You don't have permission to access this section.
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
