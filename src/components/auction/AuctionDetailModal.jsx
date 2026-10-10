import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatRemainingString, formatDateTime } from '../../utils/dateFormatter';

export default function AuctionDetailModal({ auction, onClose, onPlaceBid }) {
    const { user } = useSelector(s => s.auth);
    const [bidAmount, setBidAmount] = useState(auction.currentHighestBid + (auction.minIncrement || 500));
    const [activeImg, setActiveImg] = useState(0);

    const minBid = auction.currentHighestBid + (auction.minIncrement || 500);
    const reserveMet = auction.currentHighestBid >= (auction.reservePrice || 0);
    const gallery = auction.gallery || [auction.primaryImageUrl];

    const handleSubmitBid = () => {
        if (bidAmount < minBid) {
            alert(`Minimum bid is ${formatCurrency(minBid)}`);
            return;
        }
        onPlaceBid(auction.id, parseFloat(bidAmount));
    };

    const quickIncrements = [
        auction.minIncrement || 500,
        (auction.minIncrement || 500) * 2,
        (auction.minIncrement || 500) * 5,
        (auction.minIncrement || 500) * 10,
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" style={{ maxWidth: '960px' }} onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                {/* Header Strip */}
                <div style={{ padding: '1.5rem 2rem 0.75rem 2rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                        <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{auction.category}</span>
                        {auction.status === 'ACTIVE' && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 700 }}>
                                <span className="pulse-dot" style={{ background: '#34d399', width: '6px', height: '6px' }}></span> LIVE AUCTION
                            </span>
                        )}
                    </div>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.3 }}>{auction.title}</h2>
                </div>

                <div className="auction-room-grid">
                    {/* Left: Gallery */}
                    <div className="room-gallery">
                        <img
                            src={gallery[activeImg]}
                            alt={auction.title}
                            className="room-main-image"
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=800&q=80'; }}
                        />
                        {gallery.length > 1 && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {gallery.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={`View ${i + 1}`}
                                        onClick={() => setActiveImg(i)}
                                        style={{
                                            width: '70px', height: '55px', objectFit: 'cover',
                                            borderRadius: '8px', cursor: 'pointer', border: `2px solid ${activeImg === i ? 'var(--accent-indigo)' : 'var(--border-subtle)'}`,
                                            opacity: activeImg === i ? 1 : 0.6, transition: 'all 0.2s ease'
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Description */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{auction.description || 'No description provided.'}</p>
                        </div>

                        {/* Seller Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '10px', padding: '0.85rem 1rem', border: '1px solid var(--border-subtle)' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Seller</div>
                                <div style={{ fontWeight: 700, color: '#fff', marginTop: '2px' }}>@{auction.sellerUsername || 'trusted_seller'}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating</div>
                                <div style={{ color: '#f59e0b', fontWeight: 700 }}>⭐ {auction.sellerRating || '4.9'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Bidding Controls */}
                    <div className="bidding-controls">
                        {/* Countdown */}
                        <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Ends In</div>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>{formatRemainingString(auction.endTime)}</div>
                            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{formatDateTime(auction.endTime)}</div>
                        </div>

                        {/* Current Highest Bid */}
                        <div className="current-highest-box">
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Highest Bid</div>
                                <div className="price-display">{formatCurrency(auction.currentHighestBid)}</div>
                                {auction.currentHighestBidderUsername && (
                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>by @{auction.currentHighestBidderUsername}</div>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Reserve</div>
                                <div style={{ fontWeight: 700, color: reserveMet ? '#34d399' : '#f59e0b', marginTop: '2px' }}>
                                    {reserveMet ? '✅ Met' : '⚠️ Not Met'}
                                </div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>{formatCurrency(auction.reservePrice)}</div>
                            </div>
                        </div>

                        {/* Quick Increment Buttons */}
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Increase</div>
                            <div className="quick-inc-btns">
                                {quickIncrements.map((inc) => (
                                    <button
                                        key={inc}
                                        className="quick-inc-btn"
                                        onClick={() => setBidAmount(auction.currentHighestBid + inc)}
                                    >
                                        +{formatCurrency(inc)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Bid Input */}
                        <div className="custom-bid-form">
                            <input
                                type="number"
                                value={bidAmount}
                                min={minBid}
                                step={auction.minIncrement || 500}
                                onChange={e => setBidAmount(Number(e.target.value))}
                            />
                            <button
                                className="btn-place-bid"
                                onClick={handleSubmitBid}
                                disabled={auction.status !== 'ACTIVE'}
                            >
                                {auction.status === 'ACTIVE' ? '🔨 Place Bid' : '🔒 Ended'}
                            </button>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Min bid: {formatCurrency(minBid)} &nbsp;|&nbsp; Increment: {formatCurrency(auction.minIncrement || 500)}
                        </div>

                        {/* Auto-bid toggle (UI only) */}
                        <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>🤖 Proxy Auto-Bid</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Automatically bid up to your max</div>
                            </div>
                            <div style={{ width: '42px', height: '22px', background: 'rgba(255,255,255,0.1)', borderRadius: '11px', border: '1px solid var(--border-subtle)', cursor: 'pointer', position: 'relative' }}>
                                <div style={{ width: '16px', height: '16px', background: '#64748b', borderRadius: '50%', position: 'absolute', top: '2px', left: '2px', transition: 'all 0.2s' }}></div>
                            </div>
                        </div>

                        {/* Bid History Feed */}
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Bid History</div>
                            <div className="bid-history-feed">
                                {(auction.bidsHistory || []).map((bid) => (
                                    <div key={bid.id} className={`bid-row ${bid.isWinning ? 'winning' : ''}`}>
                                        <div>
                                            <span style={{ fontWeight: 600, color: '#f8fafc' }}>@{bid.bidder}</span>
                                            {bid.isWinning && <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>WINNING</span>}
                                        </div>
                                        <div>
                                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: bid.isWinning ? '#34d399' : '#94a3b8' }}>{formatCurrency(bid.amount)}</span>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{bid.time}</span>
                                        </div>
                                    </div>
                                ))}
                                {(!auction.bidsHistory || auction.bidsHistory.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No bids yet — be the first!</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
