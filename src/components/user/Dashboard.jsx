import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatRemainingString } from '../../utils/dateFormatter';

export default function Dashboard({ onSelectAuction }) {
    const { auctions } = useSelector(s => s.auction);
    const { user } = useSelector(s => s.auth);

    const myBids = auctions.filter(a =>
        a.bidsHistory?.some(b => b.bidder === user?.username)
    );
    const winning = myBids.filter(a => a.currentHighestBidderUsername === user?.username);
    const totalSpent = myBids.reduce((s, a) => {
        const myBid = a.bidsHistory?.find(b => b.bidder === user?.username && b.isWinning);
        return s + (myBid?.amount || 0);
    }, 0);

    return (
        <div className="dashboard-wrap">
            {/* Stats Cards */}
            <div className="stats-card-grid">
                {[
                    { title: 'Active Bids', metric: myBids.length, trend: '+2 today', positive: true, icon: '🔨' },
                    { title: 'Currently Winning', metric: winning.length, trend: `${myBids.length} total entered`, positive: winning.length > 0, icon: '🏆' },
                    { title: 'Escrow Wallet', metric: formatCurrency(user?.balance || 0), trend: 'Available to bid', positive: true, icon: '💳' },
                    { title: 'Auctions Entered', metric: myBids.length, trend: 'Total participated', positive: null, icon: '🎯' },
                ].map((s, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                        <div className="title">{s.title}</div>
                        <div className="metric">{s.metric}</div>
                        <div className={`trend ${s.positive === true ? 'positive' : s.positive === null ? '' : 'neutral'}`}>{s.trend}</div>
                    </div>
                ))}
            </div>

            {/* Active Bids Table */}
            <div className="table-panel">
                <h2>🔨 My Active Bids</h2>
                {myBids.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
                        <p>You haven't placed any bids yet. Head to the marketplace to get started!</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Auction</th>
                                <th>Category</th>
                                <th>Current Bid</th>
                                <th>Status</th>
                                <th>Ends In</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myBids.map(auction => {
                                const isWinning = auction.currentHighestBidderUsername === user?.username;
                                return (
                                    <tr key={auction.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <img src={auction.primaryImageUrl} alt="" style={{ width: '44px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                                                <span style={{ fontWeight: 600, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{auction.title}</span>
                                            </div>
                                        </td>
                                        <td><span style={{ fontSize: '0.8rem', color: '#818cf8' }}>{auction.category}</span></td>
                                        <td>
                                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: isWinning ? '#34d399' : '#f43f5e' }}>
                                                {formatCurrency(auction.currentHighestBid)}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                                                background: isWinning ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
                                                color: isWinning ? '#34d399' : '#f43f5e',
                                                border: `1px solid ${isWinning ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`
                                            }}>
                                                {isWinning ? '🏆 Winning' : '⚠️ Outbid'}
                                            </span>
                                        </td>
                                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {formatRemainingString(auction.endTime)}
                                        </td>
                                        <td>
                                            <button onClick={() => onSelectAuction(auction)} style={{
                                                background: 'var(--accent-indigo)', border: 'none', color: '#fff',
                                                padding: '0.35rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
                                            }}>
                                                {isWinning ? 'Monitor' : 'Re-Bid'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* All Auctions Reference */}
            <div className="table-panel">
                <h2>📋 All Live Auctions</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Highest Bid</th>
                            <th>Bids</th>
                            <th>Ends</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map(a => (
                            <tr key={a.id} onClick={() => onSelectAuction(a)} style={{ cursor: 'pointer' }}>
                                <td style={{ fontWeight: 600, maxWidth: '220px' }}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{a.title}</span></td>
                                <td><span style={{ color: '#818cf8', fontSize: '0.8rem' }}>{a.category}</span></td>
                                <td><span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#34d399', fontWeight: 700 }}>{formatCurrency(a.currentHighestBid)}</span></td>
                                <td>{a.totalBids}</td>
                                <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{formatRemainingString(a.endTime)}</td>
                                <td><span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: a.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', color: a.status === 'ACTIVE' ? '#34d399' : '#94a3b8' }}>{a.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
