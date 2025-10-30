import React, { createContext, useContext, useState, useEffect } from 'react';

const PermissionsContext = createContext();

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider = ({ children, user }) => {
  const [permissions, setPermissions] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user is super admin (username: admin)
      if (user.username === 'admin') {
        setIsSuperAdmin(true);
        // Super admin has all permissions
        setPermissions({
          dashboard: true,
          users: true,
          fees: true,
          verification: true,
          admin: true,
          disputes: true,
          deletion_requests: true,
          subscription: true,
          earnings: true,
          settings: true
        });
      } else {
        // Subadmin - use their specific permissions
        setIsSuperAdmin(false);
        const userPermissions = user.permissions || {};
        
        // Map backend permissions to frontend tab IDs
        setPermissions({
          dashboard: false, // Subadmins can't access dashboard
          users: userPermissions.userManagement || false,
          fees: userPermissions.feesManagement || false,
          verification: userPermissions.verification || false,
          admin: false, // Subadmins can't access admin management
          disputes: userPermissions.disputeManagement || false,
          deletion_requests: false,
          subscription: userPermissions.subscriptionPlans || false,
          earnings: userPermissions.earnings || false,
          settings: false // Subadmins can't access settings
        });
      }
    } else {
      // No user logged in
      setPermissions({});
      setIsSuperAdmin(false);
    }
  }, [user]);

  // Check if user has permission for a specific tab
  const hasPermission = (tabId) => {
    return permissions[tabId] || false;
  };

  // Get all permitted tabs
  const getPermittedTabs = () => {
    return Object.entries(permissions)
      .filter(([_, hasPermission]) => hasPermission)
      .map(([tabId]) => tabId);
  };

  // Check if user can access a specific feature
  const canAccess = (feature) => {
    return hasPermission(feature);
  };

  const value = {
    permissions,
    isSuperAdmin,
    hasPermission,
    getPermittedTabs,
    canAccess
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};
