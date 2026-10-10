import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRole, markNotificationsRead, logout } from '../../redux/slices/authSlice';
import { formatCurrency } from '../../utils/currencyFormatter';

export default function Header({ activeTab, setActiveTab, onOpenDeposit, onOpenCreate }) {
    const { user, notifications } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [showNotifications, setShowNotifications] = useState(false);

    const unreadCount = notifications?.filter(n => n.unread)?.length || 0;

    const handleRoleChange = (e) => {
        const newRole = e.target.value;
        dispatch(setRole(newRole));
        if (newRole === 'ADMIN' && activeTab !== 'admin') {
            setActiveTab('admin');
        }
    };

    const toggleNotifications = () => {
        if (!showNotifications && unreadCount > 0) {
            dispatch(markNotificationsRead());
        }
        setShowNotifications(!showNotifications);
    };

    return (
        <header className="header">
            <div className="logo" onClick={() => setActiveTab('marketplace')}>
                <span className="logo-icon">🏛️</span>
                <span className="logo-text">AUCTION<span>FLOW</span></span>
            </div>

            <nav className="nav-tabs">
                <button 
                    className={activeTab === 'marketplace' ? 'active' : ''} 
                    onClick={() => setActiveTab('marketplace')}
                >
                    <span>⚡</span> Live Auctions
                </button>
                <button 
                    className={activeTab === 'dashboard' ? 'active' : ''} 
                    onClick={() => setActiveTab('dashboard')}
                >
                    <span>📊</span> My Dashboard
                </button>
                <button 
                    className={activeTab === 'admin' ? 'active' : ''} 
                    onClick={() => setActiveTab('admin')}
                >
                    <span>🛡️</span> Admin Control
                </button>
            </nav>

            <div className="header-right">
                {/* WebSocket Real-Time Status Pill */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <span className="pulse-dot" style={{ background: '#10b981', width: '6px', height: '6px' }}></span>
                    <span style={{ fontWeight: 600 }}>STOMP Live</span>
                </div>

                {/* Wallet Balance */}
                <div 
                    className="wallet-badge" 
                    title="Click to add simulated escrow funds"
                    onClick={onOpenDeposit}
                >
                    <span>💳 Escrow:</span>
                    <span className="amount">{formatCurrency(user?.balance || 0)}</span>
                    <span style={{ fontSize: '0.7rem', color: '#818cf8', marginLeft: '2px' }}>+</span>
                </div>

                {/* Notifications Bell */}
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={toggleNotifications}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border-subtle)',
                            color: '#ffffff',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            position: 'relative'
                        }}
                    >
                        🔔
                        {unreadCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-3px',
                                right: '-3px',
                                background: '#f43f5e',
                                color: '#ffffff',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                width: '17px',
                                height: '17px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #090c15'
                            }}>
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '45px',
                            width: '300px',
                            background: '#0f172a',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                            padding: '0.85rem',
                            zIndex: 150
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', paddingBottom: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>Live Alerts</span>
                                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Real-time</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '220px', overflowY: 'auto' }}>
                                {notifications?.map(n => (
                                    <div key={n.id} style={{ fontSize: '0.785rem', padding: '0.4rem', background: n.unread ? 'rgba(99, 102, 241, 0.12)' : 'transparent', borderRadius: '6px' }}>
                                        <div style={{ color: '#f1f5f9' }}>{n.text}</div>
                                        <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>{n.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Role Switcher */}
                <div className="role-switch">
                    <span>Role:</span>
                    <select value={user?.role} onChange={handleRoleChange}>
                        <option value="BUYER">👤 Buyer</option>
                        <option value="SELLER">💼 Seller</option>
                        <option value="ADMIN">🛡️ Admin</option>
                    </select>
                </div>

                {/* Sign Out Button */}
                <button 
                    onClick={() => dispatch(logout())}
                    title="Sign Out"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#fca5a5',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <span>🚪</span>
                    <span>Sign Out</span>
                </button>
            </div>
        </header>
    );
}
