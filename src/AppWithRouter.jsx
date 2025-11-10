import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { StatsCards } from './components/dashboard/StatsCards'
import './styles/fonts.css'
import { EarningsChart } from './components/dashboard/EarningsChart'
import SignupChart from './components/dashboard/SignupChart'
import UserManagement  from './components/users/UserManagement'
import DisputeManagement from './components/users/DisputeManagement'
import Settings from './components/dashboard/Settings'
import FeesManagement from './components/dashboard/FeesManagement'
import SubscriptionManagement from './components/dashboard/SubscriptionManagement'
import Earnings from './components/dashboard/Earnings'
import AdminManagement from './components/users/AdminManagement'
import AdminVerification from './components/users/AdminVerification'
import DeletionRequests from './components/users/DeletionRequests'
import Login from './components/Login'
import PrivacyPolicy from './components/PrivacyPolicy'
import DeletePage from './components/DeletePage'
import SafetyStandards from './components/SafetyStandards'
import { DataProvider } from './contexts/DataContext.jsx'
import { PermissionsProvider, usePermissions } from './contexts/PermissionsContext.jsx'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    // Store in localStorage for persistence
    localStorage.setItem('adminUser', JSON.stringify(userData))
  }

  const handleSignout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('adminUser')
    setActiveTab('dashboard')
  }

  const handleTabChange = (tabId) => {
    if (tabId === 'signout') {
      // Automatically sign out when signout is selected
      handleSignout();
    } else {
      setActiveTab(tabId);
    }
  }

  // Check for existing login on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('adminUser')
      }
    }
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public routes - no authentication required */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/delete-data" element={<DeletePage />} />
        <Route path="/safety-standards" element={<SafetyStandards />} />
        
        {/* Protected admin routes */}
        <Route path="/*" element={
          isAuthenticated ? (
            <PermissionsProvider user={user}>
              <AppMainContent 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                handleTabChange={handleTabChange}
                user={user}
                onSignout={handleSignout}
              />
            </PermissionsProvider>
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
      </Routes>
    </Router>
  )
}

function AppMainContent({ activeTab, setActiveTab, handleTabChange, user, onSignout }) {
  const { getPermittedTabs } = usePermissions()

  // Redirect subadmins away from dashboard to their first permitted tab
  useEffect(() => {
    if (user && user.role === 'sub_admin' && activeTab === 'dashboard') {
      const permittedTabs = getPermittedTabs()
      if (permittedTabs.length > 0) {
        setActiveTab(permittedTabs[0])
      }
    }
  }, [user, activeTab, getPermittedTabs, setActiveTab])

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f3f5f7',
      padding: '24px',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      <div style={{ flex: '1', paddingLeft: '24px', paddingRight: '24px' }}>
        <Header 
          title={
            activeTab === 'users' ? 'User Management' : 
            activeTab === 'fees' ? 'Fees Management' : 
            activeTab === 'subscription' ? 'Subscription Plans' :
            activeTab === 'earnings' ? 'Earnings' :
            activeTab === 'disputes' ? 'Dispute Management' :
            activeTab === 'settings' ? 'Settings' :
            activeTab === 'deletion_requests' ? 'Deletion Requests' :
            'Admin Dashboard'
          }
          user={user}
          onSignout={onSignout}
        />
        {activeTab === 'dashboard' ? (
          <ProtectedRoute tabId="dashboard">
            <div style={{ display: 'grid', gridTemplateColumns: '325px 1fr', gap: '16px' }}>
              <StatsCards />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <EarningsChart />
                <SignupChart />
              </div>
            </div>
          </ProtectedRoute>
        ) : activeTab === 'users' ? (
          <ProtectedRoute tabId="users">
            <UserManagement />
          </ProtectedRoute>
        ) : activeTab === 'disputes' ? (
          <ProtectedRoute tabId="disputes">
            <DisputeManagement />
          </ProtectedRoute>
        ) : activeTab === 'settings' ? (
          <ProtectedRoute tabId="settings">
            <Settings />
          </ProtectedRoute>
        ) : activeTab === 'fees' ? (
          <ProtectedRoute tabId="fees">
            <FeesManagement />
          </ProtectedRoute>
        ) : activeTab === 'subscription' ? (
          <ProtectedRoute tabId="subscription">
            <SubscriptionManagement />
          </ProtectedRoute>
        ) : activeTab === 'earnings' ? (
          <ProtectedRoute tabId="earnings">
            <Earnings />
          </ProtectedRoute>
        ) : activeTab === 'admin' ? (
          <ProtectedRoute tabId="admin">
            <AdminManagement />
          </ProtectedRoute>
        ) : activeTab === 'verification' ? (
          <ProtectedRoute tabId="verification">
            <AdminVerification />
          </ProtectedRoute>
        ) : activeTab === 'deletion_requests' ? (
          <ProtectedRoute tabId="deletion_requests">
            <DeletionRequests />
          </ProtectedRoute>
        ) : null}
      </div>
    </div>
  )
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  )
}

export default App
