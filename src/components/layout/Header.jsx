import bellIcon from '../../assets/images/bell.png'
import manIcon from '../../assets/images/man.png'

export const Header = ({ title = "Admin Dashboard", user, onSignout }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '16px 24px', 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ 
        fontSize: '24px', 
        fontWeight: '700', 
        color: '#121212', 
        margin: '0' 
      }}>{title}</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* User Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <img
            src={manIcon}
            alt="Admin Avatar"
            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
          />
        </div>

        {/* Notifications */}
        <img 
          src={bellIcon} 
          alt="Notifications"
          style={{ width: '24px', height: '24px', cursor: 'pointer' }}
        />
      </div>
    </div>
  )
}
