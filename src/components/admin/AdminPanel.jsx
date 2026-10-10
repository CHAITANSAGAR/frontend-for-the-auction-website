import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { endAuction, deleteAuction } from '../../redux/slices/auctionSlice';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatRemainingString } from '../../utils/dateFormatter';

export default function AdminPanel() {
    const { auctions } = useSelector(s => s.auction);
    const dispatch = useDispatch();

    const stats = {
        total: auctions.length,
        active: auctions.filter(a => a.status === 'ACTIVE').length,
        ended: auctions.filter(a => a.status === 'ENDED').length,
        totalBids: auctions.reduce((s, a) => s + (a.totalBids || 0), 0),
        gmv: auctions.reduce((s, a) => s + (a.currentHighestBid || 0), 0),
    };

    return (
        <div className="dashboard-wrap">
            <div style={{ marginBottom: '0.5rem' }}>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 800 }}>🛡️ Admin Control Center</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Real-time oversight of all platform auctions, users, and transactions.</p>
            </div>

            {/* Admin Stats */}
            <div className="stats-card-grid">
                {[
                    { icon: '⚡', title: 'Active Auctions', val: stats.active, sub: `${stats.ended} ended`, color: '#34d399' },
                    { icon: '🔨', title: 'Total Bids', val: stats.totalBids.toLocaleString(), sub: 'Across all auctions', color: '#818cf8' },
                    { icon: '💰', title: 'Gross Market Value', val: formatCurrency(stats.gmv), sub: 'Total bid amounts', color: '#f59e0b' },
                    { icon: '📋', title: 'Total Auctions', val: stats.total, sub: 'Platform-wide', color: '#06b6d4' },
                ].map((s, i) => (
                    <div key={i} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
                        <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                        <div className="title">{s.title}</div>
                        <div className="metric" style={{ color: s.color }}>{s.val}</div>
                        <div className="trend neutral">{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* Auction Management Table */}
            <div className="table-panel">
                <h2>📋 Auction Management</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Auction</th>
                            <th>Category</th>
                            <th>Seller</th>
                            <th>Current Bid</th>
                            <th>Bids</th>
                            <th>Ends In</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map(a => (
                            <tr key={a.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <img src={a.primaryImageUrl} alt="" style={{ width: '44px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                                        <span style={{ fontWeight: 600, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{a.title}</span>
                                    </div>
                                </td>
                                <td><span style={{ color: '#818cf8', fontSize: '0.8rem' }}>{a.category}</span></td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>@{a.sellerUsername}</td>
                                <td><span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#34d399', fontWeight: 700 }}>{formatCurrency(a.currentHighestBid)}</span></td>
                                <td style={{ color: 'var(--text-secondary)' }}>{a.totalBids}</td>
                                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatRemainingString(a.endTime)}</td>
                                <td>
                                    <span style={{
                                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700,
                                        background: a.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                                        color: a.status === 'ACTIVE' ? '#34d399' : '#94a3b8',
                                    }}>{a.status}</span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {a.status === 'ACTIVE' && (
                                            <button
                                                onClick={() => dispatch(endAuction(a.id))}
                                                style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '0.3rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.775rem', fontWeight: 600 }}
                                            >
                                                End
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { if(window.confirm(`Delete "${a.title}"?`)) dispatch(deleteAuction(a.id)); }}
                                            style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.3)', padding: '0.3rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.775rem', fontWeight: 600 }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* System Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="table-panel">
                    <h2>🔌 Backend Architecture</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {[
                            ['Framework', 'Spring Boot 3.3 / JDK 21'],
                            ['Database', 'MySQL 8.x + Flyway Migrations'],
                            ['Auth', 'JWT Bearer + Spring Security 6'],
                            ['Real-time', 'STOMP over SockJS WebSocket'],
                            ['Payments', 'Stripe SDK (Escrow Mode)'],
                            ['API Docs', 'SpringDoc OpenAPI 3 / Swagger'],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>{v}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="table-panel">
                    <h2>⚙️ System Status</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                        {[
                            { svc: 'WebSocket STOMP', status: 'Simulated', ok: true },
                            { svc: 'REST API Gateway', status: 'localhost:8080', ok: false },
                            { svc: 'MySQL Database', status: 'Offline (local)', ok: false },
                            { svc: 'Stripe Webhook', status: 'Test Mode', ok: true },
                            { svc: 'Redis Cache', status: 'Not configured', ok: false },
                            { svc: 'Frontend Vite', status: 'Running :3000 ✅', ok: true },
                        ].map(s => (
                            <div key={s.svc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{s.svc}</span>
                                <span style={{ fontSize: '0.775rem', fontWeight: 700, color: s.ok ? '#34d399' : '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>{s.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
