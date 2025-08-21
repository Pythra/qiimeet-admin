import logo from '../../assets/images/blago.png'

export const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <img 
      src={logo} 
      alt="Qiimeet Logo" 
      style={{ width: '114px', height: 'auto', borderRadius: '8px' }}
    />
  </div>
)
