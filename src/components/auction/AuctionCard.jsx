import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatRemainingString } from '../../utils/dateFormatter';

export default function AuctionCard({ auction, onSelect, onQuickBid }) {
    const [timeLeft, setTimeLeft] = useState(formatRemainingString(auction.endTime));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(formatRemainingString(auction.endTime));
        }, 1000);
        return () => clearInterval(timer);
    }, [auction.endTime]);

    const isEndingSoon = () => {
        const end = Date.parse(auction.endTime) - Date.now();
        return end > 0 && end < 3600000 * 2; // within 2 hours
    };

    const reserveMet = auction.currentHighestBid >= (auction.reservePrice || 0);
    const nextBid = auction.currentHighestBid + (auction.minIncrement || 500);

    return (
        <div className="auction-card" onClick={() => onSelect(auction)} style={{ cursor: 'pointer' }}>
            {/* Image */}
            <div className="card-img-wrap">
                <img
                    src={auction.primaryImageUrl}
                    alt={auction.title}
                    className="card-img"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?auto=format&fit=crop&w=800&q=80'; }}
                />

                {/* Status Badge */}
                <div className={`card-badge ${auction.status === 'ACTIVE' ? 'active-badge' : ''}`}>
                    {auction.status === 'ACTIVE' ? <><span className="pulse-dot" style={{ background: '#34d399', width: '6px', height: '6px' }}></span> LIVE</> : auction.status}
                </div>

                {/* Countdown Timer Badge */}
                <div className={`card-timer-badge`} style={{ color: isEndingSoon() ? '#f43f5e' : '#f8fafc' }}>
                    ⏱ {timeLeft}
                </div>
            </div>

            {/* Card Body */}
            <div className="card-body">
                <div className="card-meta-row">
                    <span className="card-category">{auction.category}</span>
                    <span className="card-condition">{auction.condition || 'VERIFIED'}</span>
                </div>
                <h3 className="card-title">{auction.title}</h3>

                {/* Current Bid Info */}
                <div className="bid-info">
                    <div>
                        <div className="label">Current Bid</div>
                        <div className="amount">{formatCurrency(auction.currentHighestBid)}</div>
                        {auction.currentHighestBidderUsername && (
                            <div className="bidder-tag">by @{auction.currentHighestBidderUsername}</div>
                        )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reserve</div>
                        <div style={{ fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace', color: reserveMet ? '#34d399' : '#f59e0b', fontWeight: 700 }}>
                            {reserveMet ? '✅ MET' : '⚠️ NOT MET'}
                        </div>
                    </div>
                </div>

                {/* Footer: Bids count + actions */}
                <div className="card-footer">
                    <span className="bids-count">🔨 {auction.totalBids || 0} bids</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {auction.status === 'ACTIVE' && (
                            <button
                                className="btn-quick-bid"
                                onClick={(e) => onQuickBid(auction, e)}
                                title={`Quick bid: ${formatCurrency(nextBid)}`}
                            >
                                +{formatCurrency(auction.minIncrement || 500)}
                            </button>
                        )}
                        <button className="btn-bid" onClick={(e) => { e.stopPropagation(); onSelect(auction); }}>
                            View & Bid
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
