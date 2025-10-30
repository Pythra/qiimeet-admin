import { Logo } from '../ui/Logo'
import dashIcon from '../../assets/images/dashicon.png'
import userIcon from '../../assets/images/usicon.png'
import dollIcon from '../../assets/images/dollicon.png'
import verIcon from '../../assets/images/vericon.png'
import unionIcon from '../../assets/images/union.png'
import disIcon from '../../assets/images/discon.png'
import earIcon from '../../assets/images/earcon.png'
import setIcon from '../../assets/images/setcon.png'
import signIcon from '../../assets/images/signcon.png'
import { usePermissions } from '../../contexts/PermissionsContext'

const menuItems = [
	{ id: 'dashboard', label: 'Dashboard', icon: dashIcon },
	{ id: 'users', label: 'User Management', icon: userIcon },
	{ id: 'fees', label: 'Fees Management', icon: dollIcon },
	{ id: 'verification', label: 'Verification', icon: verIcon },
	{ id: 'admin', label: 'Admin Management', icon: unionIcon },
	{ id: 'disputes', label: 'Dispute Management', icon: disIcon },
	{ id: 'deletion_requests', label: 'Deletion Requests', icon: disIcon },
	{ id: 'subscription', label: 'Subscription Plans', icon: dollIcon },
	{ id: 'earnings', label: 'Earnings', icon: earIcon },
	{ id: 'settings', label: 'Settings', icon: setIcon },
	{ id: 'signout', label: 'Sign out', icon: signIcon },
]

export const Sidebar = ({ activeTab, setActiveTab }) => {
	const { hasPermission } = usePermissions();

	// Filter menu items based on permissions
	const permittedMenuItems = menuItems.filter(item => {
		if (item.id === 'signout') {
			return true; // Always show signout
		}
		return hasPermission(item.id);
	});

	return (
		<div
			style={{
				width: '380px',
				height: '976px',
				backgroundColor: 'white',
				boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<div style={{ padding: '24px', marginBottom: '16px'}}>
				<Logo />
			</div>

			<nav style={{ padding: '16px', height:'776px' }}>
				<ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
					{permittedMenuItems.map((item) => {
						const isActive = item.id === activeTab
						return (
							<li key={item.id} style={{ marginBottom: '24px' }}>
								<button
									onClick={() => setActiveTab(item.id)}
									style={{
										width: '100%',
										display: 'flex',
										alignItems: 'center',
										fontSize: '16px',
										gap: '24px',
										padding: '10px 12px',
										borderRadius: '8px',
										border: 'none',
										textAlign: 'left',
										cursor: 'pointer',
										backgroundColor: isActive ? '#EC066A' : 'white',
										transition: 'all 0.2s ease',
									}}
								>
									<div style={{ width: '32px', display: 'flex', justifyContent: 'center' }}>
										<img 
											src={item.icon} 
											alt={item.label}
											style={{ 
												width: item.id === 'users' ? '32px' : '24px',
												height: item.id === 'users' ? '24px' : '24px',
												filter: isActive ? 'brightness(0) saturate(100%) invert(100%)' : 'none'
											}} 
										/>
									</div>
									<span style={{ 
										fontSize: '16px', 
										fontWeight: '600', 
										lineHeight:'24px',
										color: isActive ? '#ffffff' : item.id === 'signout' ? '#FF0000' : '#121212'
									}}>
										{item.label}
									</span>
								</button>
							</li>
						)
					})}
				</ul>
			</nav>
		</div>
	)
}
