import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBid, setSelectedAuction, clearSelectedAuction, createAuction, setSelectedCategory, setSearchQuery } from './redux/slices/auctionSlice';
import { updateBalance, addNotification } from './redux/slices/authSlice';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import AuctionCard from './components/auction/AuctionCard';
import AuctionDetailModal from './components/auction/AuctionDetailModal';
import CreateAuctionModal from './components/auction/CreateAuctionModal';
import Dashboard from './components/user/Dashboard';
import ProfileSettings from './components/user/ProfileSettings';
import AdminPanel from './components/admin/AdminPanel';
import AuthGate from './components/auth/AuthGate';
import { formatCurrency } from './utils/currencyFormatter';
import { formatRemainingString } from './utils/dateFormatter';

const CATEGORIES = ['ALL', 'Watches', 'Vehicles', 'Art', 'Jewelry', 'Collectibles', 'Digital Art'];

export default function App() {
    const dispatch = useDispatch();
    const { auctions, selectedAuction, selectedCategory, searchQuery, liveFeed } = useSelector(s => s.auction);
    const { user, isAuthenticated } = useSelector(s => s.auth);

    const [activeTab, setActiveTab] = useState('marketplace');
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [toasts, setToasts] = useState([]);

    const pushToast = useCallback((msg, type = 'toast-bid') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, msg, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
    }, []);

    // Simulated live bid feed (mimics WebSocket)
    useEffect(() => {
        if (!isAuthenticated) return;
        const bidders = ['racer_x', 'sophia_collector', 'gallery_geneva', 'david_k', 'lady_monaco', 'satoshi_vault'];
        const interval = setInterval(() => {
            const liveAuctions = auctions.filter(a => a.status === 'ACTIVE');
            if (liveAuctions.length === 0) return;
            const randomAuction = liveAuctions[Math.floor(Math.random() * liveAuctions.length)];
            const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
            const increment = randomAuction.minIncrement || 500;
            const newBid = randomAuction.currentHighestBid + increment;
            dispatch(updateBid({ auctionId: randomAuction.id, amount: newBid, bidderUsername: randomBidder }));
            const isUserAuction = randomAuction.currentHighestBidderUsername === user?.username;
            if (isUserAuction) {
                pushToast(`You've been outbid on ${randomAuction.title.slice(0, 35)}...`, 'toast-outbid');
                dispatch(addNotification(`You were outbid on ${randomAuction.title.slice(0, 40)}!`));
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [auctions, dispatch, pushToast, user, isAuthenticated]);

    const handleSelectAuction = (auction) => {
        dispatch(setSelectedAuction(auction));
        setShowDetailModal(true);
    };

    const handleQuickBid = (auction, e) => {
        e.stopPropagation();
        const newAmount = auction.currentHighestBid + (auction.minIncrement || 500);
        if ((user?.balance || 0) < newAmount) {
            pushToast('Insufficient escrow balance. Please deposit funds.', 'toast-outbid');
            return;
        }
        dispatch(updateBid({ auctionId: auction.id, amount: newAmount, bidderUsername: user?.username || 'alex_bidder' }));
        dispatch(updateBalance(-newAmount * 0.1));
        pushToast(`Quick-bid of ${formatCurrency(newAmount)} placed! ✅`, 'toast-bid');
    };

    const handlePlaceBid = (auctionId, amount) => {
        if ((user?.balance || 0) < amount) {
            pushToast('Insufficient escrow balance. Please deposit funds.', 'toast-outbid');
            return;
        }
        dispatch(updateBid({ auctionId, amount, bidderUsername: user?.username || 'alex_bidder' }));
        dispatch(updateBalance(-amount * 0.1));
        pushToast(`Bid of ${formatCurrency(amount)} confirmed! 🎯`, 'toast-bid');
    };

    const handleCreateAuction = (formData) => {
        dispatch(createAuction({ ...formData, sellerUsername: user?.username || 'victor_seller' }));
        setShowCreateModal(false);
        pushToast(`Auction "${formData.title.slice(0, 30)}" is now live! 🚀`, 'toast-bid');
    };

    const handleDeposit = (amount) => {
        dispatch(updateBalance(parseFloat(amount)));
        setShowDepositModal(false);
        pushToast(`${formatCurrency(amount)} added to your escrow wallet ✅`, 'toast-bid');
    };

    const filteredAuctions = auctions.filter(a => {
        const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
        const matchesSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
    });

    if (!isAuthenticated) {
        return <AuthGate />;
    }

    const isMarketplaceLike = activeTab === 'marketplace' || activeTab === 'catalogue';

    return (
        <div className="app-shell">
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenDeposit={() => setShowDepositModal(true)}
                onOpenCreate={() => setShowCreateModal(true)}
            />

            <div className="app-body">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onOpenDeposit={() => setShowDepositModal(true)}
                />

                <main className="app-main">
                    {/* ── MARKETPLACE / CATALOGUE ── */}
                    {isMarketplaceLike && (
                        <>
                            {activeTab === 'marketplace' && (
                                <div className="hero-banner">
                                    <div className="hero-content">
                                        <div className="hero-title-group">
                                            <h1>
                                                <span className="gradient-text">The World's Premier</span><br />
                                                <span className="highlight-text">Real-Time Auction Platform</span>
                                            </h1>
                                            <p>Live WebSocket bidding, automated proxy bids, Stripe escrow — built on Spring Boot &amp; React.</p>
                                        </div>
                                        <div className="hero-stats">
                                            <div className="hero-stat-item">
                                                <span className="val">{auctions.filter(a => a.status === 'ACTIVE').length}</span>
                                                <span className="lbl">Live Now</span>
                                            </div>
                                            <div className="hero-stat-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.5rem' }}>
                                                <span className="val">{auctions.reduce((s, a) => s + (a.totalBids || 0), 0)}</span>
                                                <span className="lbl">Total Bids</span>
                                            </div>
                                            <div className="hero-stat-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: '1.5rem' }}>
                                                <span className="val">{formatCurrency(auctions.reduce((s, a) => s + (a.currentHighestBid || 0), 0) / 1000).replace('$', '$')} K+</span>
                                                <span className="lbl">GMV Total</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="live-ticker">
                                        <span className="ticker-badge">
                                            <span className="pulse-dot"></span> LIVE
                                        </span>
                                        <div style={{ overflow: 'hidden', flex: 1 }}>
                                            <div className="ticker-feed">
                                                {[...liveFeed, ...liveFeed].map((item, i) => (
                                                    <span key={i}>
                                                        {item.type === 'BID' ? '💰' : item.type === 'RESERVE_MET' ? '✅' : '🆕'}{' '}
                                                        <strong>{item.text}</strong>&nbsp;&nbsp;—&nbsp;&nbsp;
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="controls-bar">
                                <div className="categories-pills">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                                            onClick={() => dispatch(setSelectedCategory(cat))}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="search-filter-group">
                                    <div className="search-input-wrap">
                                        <span className="search-icon">🔍</span>
                                        <input
                                            type="text"
                                            placeholder={activeTab === 'catalogue' ? 'Search catalogue...' : 'Search auctions...'}
                                            value={searchQuery}
                                            onChange={e => dispatch(setSearchQuery(e.target.value))}
                                        />
                                    </div>
                                    {(user?.role === 'SELLER' || user?.role === 'ADMIN') && (
                                        <button className="btn-create-auction" onClick={() => setShowCreateModal(true)}>
                                            <span>+</span> Create Auction
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="auctions-grid">
                                {filteredAuctions.length === 0 ? (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                                        <p style={{ fontSize: '1.1rem' }}>No auctions found for your filters.</p>
                                    </div>
                                ) : (
                                    (activeTab === 'catalogue' ? auctions : filteredAuctions).map(auction => (
                                        <AuctionCard
                                            key={auction.id}
                                            auction={auction}
                                            onSelect={handleSelectAuction}
                                            onQuickBid={handleQuickBid}
                                        />
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === 'dashboard' && <Dashboard onSelectAuction={handleSelectAuction} />}
                    {activeTab === 'admin'     && <AdminPanel />}
                    {activeTab === 'profile'   && (
                        <div className="profile-page-wrapper">
                            <ProfileSettings />
                        </div>
                    )}
                </main>
            </div>

            {/* ── MODALS ── */}
            {showDetailModal && selectedAuction && (
                <AuctionDetailModal
                    auction={selectedAuction}
                    onClose={() => { setShowDetailModal(false); dispatch(clearSelectedAuction()); }}
                    onPlaceBid={handlePlaceBid}
                />
            )}
            {showCreateModal && (
                <CreateAuctionModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateAuction}
                />
            )}
            {showDepositModal && (
                <DepositModal
                    onClose={() => setShowDepositModal(false)}
                    onDeposit={handleDeposit}
                />
            )}

            {/* ── TOASTS ── */}
            <div className="toast-container">
                {toasts.map(t => (
                    <div key={t.id} className={`toast ${t.type}`}>
                        <span>{t.type === 'toast-bid' ? '✅' : '⚠️'}</span>
                        <span>{t.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DepositModal({ onClose, onDeposit }) {
    const [amount, setAmount] = useState('10000');
    const presets = [5000, 10000, 25000, 50000];
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>
                <div style={{ padding: '2rem' }}>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>💳 Add Escrow Funds</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Simulated Stripe escrow — funds are held until auction completes.</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        {presets.map(p => (
                            <button key={p} onClick={() => setAmount(String(p))} style={{
                                background: amount === String(p) ? 'var(--accent-indigo)' : 'var(--bg-input)',
                                border: '1px solid var(--border-subtle)',
                                color: '#ffffff',
                                padding: '0.4rem 0.85rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>
                                ${p.toLocaleString()}
                            </button>
                        ))}
                    </div>
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        style={{ width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: '#ffffff', padding: '0.75rem', borderRadius: '8px', fontSize: '1.1rem', fontFamily: 'JetBrains Mono, monospace', marginBottom: '1rem', outline: 'none' }}
                    />
                    <button onClick={() => onDeposit(amount)} style={{
                        width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none', color: '#fff', fontWeight: 700, fontSize: '1rem',
                        padding: '0.875rem', borderRadius: '8px', cursor: 'pointer'
                    }}>
                        Add ${parseFloat(amount || 0).toLocaleString()} to Wallet
                    </button>
                </div>
            </div>
        </div>
    );
}
