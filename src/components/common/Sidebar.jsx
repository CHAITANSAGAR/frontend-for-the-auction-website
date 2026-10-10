import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/currencyFormatter';

const NAV_ITEMS = [
    { id: 'marketplace', icon: '⚡', label: 'Live Auctions', badge: 'LIVE' },
    { id: 'catalogue',   icon: '📋', label: 'Catalogue',    badge: null },
    { id: 'dashboard',   icon: '📊', label: 'My Activity',  badge: null },
    { id: 'admin',       icon: '🛡️', label: 'Admin Control', badge: null, adminOnly: true },
    { id: 'blueprint',   icon: '📐', label: 'Architecture',  badge: null },
];

export default function Sidebar({ activeTab, setActiveTab, onOpenDeposit }) {
    const { user } = useSelector(s => s.auth);
    const { auctions } = useSelector(s => s.auction);
    const [collapsed, setCollapsed] = useState(false);

    const liveCount = auctions.filter(a => a.status === 'ACTIVE').length;

    const visibleItems = NAV_ITEMS.filter(item =>
        !item.adminOnly || user?.role === 'ADMIN'
    );

    return (
        <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
            {/* Collapse toggle */}
            <button
                className="sidebar__toggle"
                onClick={() => setCollapsed(c => !c)}
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? '›' : '‹'}
            </button>

            {/* User card */}
            <div className="sidebar__user-card">
                <div className="sidebar__avatar">
                    {(user?.username || 'U')[0].toUpperCase()}
                </div>
                {!collapsed && (
                    <div className="sidebar__user-info">
                        <span className="sidebar__username">{user?.username || 'Guest'}</span>
                        <span className={`sidebar__role-badge sidebar__role-badge--${(user?.role || 'BUYER').toLowerCase()}`}>
                            {user?.role === 'BUYER' ? '👤' : user?.role === 'SELLER' ? '💼' : '🛡️'} {user?.role || 'BUYER'}
                        </span>
                    </div>
                )}
            </div>

            {/* Wallet quick-access */}
            {!collapsed && (
                <button className="sidebar__wallet" onClick={onOpenDeposit}>
                    <span className="sidebar__wallet-label">💳 Escrow Balance</span>
                    <span className="sidebar__wallet-amount">{formatCurrency(user?.balance || 0)}</span>
                    <span className="sidebar__wallet-add">+ Add Funds</span>
                </button>
            )}

            {/* Navigation */}
            <nav className="sidebar__nav">
                {visibleItems.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar__nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                        title={collapsed ? item.label : undefined}
                    >
                        <span className="sidebar__nav-icon">{item.icon}</span>
                        {!collapsed && (
                            <>
                                <span className="sidebar__nav-label">{item.label}</span>
                                {item.badge === 'LIVE' && liveCount > 0 && (
                                    <span className="sidebar__live-badge">
                                        <span className="pulse-dot" style={{ background: '#10b981', width: 6, height: 6 }} />
                                        {liveCount}
                                    </span>
                                )}
                            </>
                        )}
                        {collapsed && item.badge === 'LIVE' && liveCount > 0 && (
                            <span className="sidebar__live-dot" />
                        )}
                    </button>
                ))}
            </nav>

            {/* Bottom: Profile Settings */}
            <div className="sidebar__bottom">
                <button
                    className={`sidebar__nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                    title={collapsed ? 'Profile & Settings' : undefined}
                >
                    <span className="sidebar__nav-icon">⚙️</span>
                    {!collapsed && <span className="sidebar__nav-label">Profile & Settings</span>}
                </button>
            </div>
        </aside>
    );
}
