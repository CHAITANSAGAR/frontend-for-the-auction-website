import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setRole, updateBalance } from '../../redux/slices/authSlice';
import { formatCurrency } from '../../utils/currencyFormatter';

const AVATAR_COLORS = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#f43f5e,#e11d48)',
    'linear-gradient(135deg,#06b6d4,#0891b2)',
];

export default function ProfileSettings() {
    const dispatch = useDispatch();
    const { user, notifications } = useSelector(s => s.auth);

    const [activeSection, setActiveSection] = useState('profile');
    const [avatarColorIdx, setAvatarColorIdx] = useState(0);
    const [displayName, setDisplayName] = useState(user?.username || 'alex_bidder');
    const [emailNotif, setEmailNotif] = useState(true);
    const [pushNotif, setPushNotif] = useState(true);
    const [outbidAlert, setOutbidAlert] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const roleLabels = { BUYER: '👤 Buyer', SELLER: '💼 Seller', ADMIN: '🛡️ Admin' };

    const sections = [
        { id: 'profile',   icon: '👤', label: 'Profile' },
        { id: 'security',  icon: '🔐', label: 'Security' },
        { id: 'notifs',    icon: '🔔', label: 'Notifications' },
        { id: 'billing',   icon: '💳', label: 'Billing & Escrow' },
        { id: 'activity',  icon: '📜', label: 'Activity Log' },
    ];

    return (
        <div className="profile-settings">
            {/* Left panel */}
            <div className="profile-settings__sidebar">
                <div className="profile-settings__avatar-wrap">
                    <div
                        className="profile-settings__avatar"
                        style={{ background: AVATAR_COLORS[avatarColorIdx] }}
                    >
                        {(user?.username || 'U')[0].toUpperCase()}
                    </div>
                    <div className="profile-settings__avatar-pickers">
                        {AVATAR_COLORS.map((c, i) => (
                            <button
                                key={i}
                                className={`profile-settings__color-dot ${i === avatarColorIdx ? 'active' : ''}`}
                                style={{ background: c }}
                                onClick={() => setAvatarColorIdx(i)}
                            />
                        ))}
                    </div>
                    <p className="profile-settings__name">{user?.username || 'alex_bidder'}</p>
                    <span className={`sidebar__role-badge sidebar__role-badge--${(user?.role || 'BUYER').toLowerCase()}`}>
                        {roleLabels[user?.role || 'BUYER']}
                    </span>
                </div>

                <nav className="profile-settings__nav">
                    {sections.map(s => (
                        <button
                            key={s.id}
                            className={`profile-settings__nav-item ${activeSection === s.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(s.id)}
                        >
                            <span>{s.icon}</span> {s.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Right panel */}
            <div className="profile-settings__main">

                {/* ── PROFILE ── */}
                {activeSection === 'profile' && (
                    <div className="ps-section">
                        <h2 className="ps-section__title">Profile Information</h2>
                        <p className="ps-section__sub">Manage your public identity and role preferences.</p>

                        <div className="ps-field">
                            <label>Display Name</label>
                            <input
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                placeholder="Your display name"
                            />
                        </div>
                        <div className="ps-field">
                            <label>Email Address</label>
                            <input defaultValue={`${user?.username || 'alex_bidder'}@auctionflow.io`} readOnly style={{ opacity: 0.6 }} />
                        </div>
                        <div className="ps-field">
                            <label>Platform Role</label>
                            <select
                                value={user?.role || 'BUYER'}
                                onChange={e => dispatch(setRole(e.target.value))}
                            >
                                <option value="BUYER">👤 Buyer</option>
                                <option value="SELLER">💼 Seller</option>
                                <option value="ADMIN">🛡️ Admin</option>
                            </select>
                        </div>
                        <div className="ps-field">
                            <label>Member Since</label>
                            <input value="October 2024" readOnly style={{ opacity: 0.6 }} />
                        </div>

                        <div className="ps-stats-row">
                            <div className="ps-stat">
                                <span className="ps-stat__value">{notifications?.length || 0}</span>
                                <span className="ps-stat__label">Notifications</span>
                            </div>
                            <div className="ps-stat">
                                <span className="ps-stat__value">{formatCurrency(user?.balance || 0)}</span>
                                <span className="ps-stat__label">Escrow Balance</span>
                            </div>
                            <div className="ps-stat">
                                <span className="ps-stat__value">12</span>
                                <span className="ps-stat__label">Total Bids</span>
                            </div>
                            <div className="ps-stat">
                                <span className="ps-stat__value">3</span>
                                <span className="ps-stat__label">Auctions Won</span>
                            </div>
                        </div>

                        <button className={`ps-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
                            {saved ? '✅ Saved!' : 'Save Changes'}
                        </button>
                    </div>
                )}

                {/* ── SECURITY ── */}
                {activeSection === 'security' && (
                    <div className="ps-section">
                        <h2 className="ps-section__title">Security</h2>
                        <p className="ps-section__sub">Protect your account with strong credentials.</p>

                        <div className="ps-field">
                            <label>Current Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <div className="ps-field">
                            <label>New Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>
                        <div className="ps-field">
                            <label>Confirm New Password</label>
                            <input type="password" placeholder="••••••••" />
                        </div>

                        <div className="ps-toggle-row">
                            <div>
                                <p className="ps-toggle-row__title">Two-Factor Authentication</p>
                                <p className="ps-toggle-row__sub">Require OTP on login</p>
                            </div>
                            <label className="ps-toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="ps-toggle__track" />
                            </label>
                        </div>
                        <div className="ps-toggle-row">
                            <div>
                                <p className="ps-toggle-row__title">Login Alerts</p>
                                <p className="ps-toggle-row__sub">Email me on new device sign-in</p>
                            </div>
                            <label className="ps-toggle">
                                <input type="checkbox" defaultChecked />
                                <span className="ps-toggle__track" />
                            </label>
                        </div>

                        <button className={`ps-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
                            {saved ? '✅ Saved!' : 'Update Password'}
                        </button>
                    </div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {activeSection === 'notifs' && (
                    <div className="ps-section">
                        <h2 className="ps-section__title">Notification Preferences</h2>
                        <p className="ps-section__sub">Control how and when you receive alerts.</p>

                        {[
                            { label: 'Email Notifications', sub: 'Receive bid updates via email', state: emailNotif, set: setEmailNotif },
                            { label: 'Push Notifications', sub: 'Browser push alerts for live events', state: pushNotif, set: setPushNotif },
                            { label: 'Outbid Alerts', sub: 'Notify immediately when you are outbid', state: outbidAlert, set: setOutbidAlert },
                        ].map(({ label, sub, state, set }) => (
                            <div key={label} className="ps-toggle-row">
                                <div>
                                    <p className="ps-toggle-row__title">{label}</p>
                                    <p className="ps-toggle-row__sub">{sub}</p>
                                </div>
                                <label className="ps-toggle">
                                    <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} />
                                    <span className="ps-toggle__track" />
                                </label>
                            </div>
                        ))}

                        <div className="ps-field" style={{ marginTop: '1.5rem' }}>
                            <label>Notification Frequency</label>
                            <select defaultValue="instant">
                                <option value="instant">Instant</option>
                                <option value="digest">Daily Digest</option>
                                <option value="weekly">Weekly Summary</option>
                            </select>
                        </div>

                        <button className={`ps-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
                            {saved ? '✅ Saved!' : 'Save Preferences'}
                        </button>
                    </div>
                )}

                {/* ── BILLING ── */}
                {activeSection === 'billing' && (
                    <div className="ps-section">
                        <h2 className="ps-section__title">Billing & Escrow</h2>
                        <p className="ps-section__sub">Manage your escrow wallet and payment methods.</p>

                        <div className="ps-wallet-card">
                            <div className="ps-wallet-card__label">Current Escrow Balance</div>
                            <div className="ps-wallet-card__amount">{formatCurrency(user?.balance || 0)}</div>
                            <div className="ps-wallet-card__sub">Held securely via Stripe escrow</div>
                        </div>

                        <div className="ps-field">
                            <label>Add Funds</label>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                {[5000, 10000, 25000, 50000].map(p => (
                                    <button
                                        key={p}
                                        className="ps-preset-btn"
                                        onClick={() => dispatch(updateBalance(p))}
                                    >
                                        +${p.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="ps-field">
                            <label>Payment Method on File</label>
                            <div className="ps-card-row">
                                <span>💳</span>
                                <span>Visa ending in •••• 4242</span>
                                <span className="ps-card-row__badge">Default</span>
                            </div>
                        </div>

                        <div className="ps-field">
                            <label>Transaction History</label>
                            {[
                                { desc: 'Escrow deposit', amount: '+$25,000', date: 'Oct 4, 2024' },
                                { desc: 'Bid hold — Rolex Daytona', amount: '-$8,500', date: 'Oct 3, 2024' },
                                { desc: 'Bid returned — Ferrari 458', amount: '+$12,000', date: 'Oct 2, 2024' },
                            ].map((t, i) => (
                                <div key={i} className="ps-tx-row">
                                    <div>
                                        <p className="ps-tx-row__desc">{t.desc}</p>
                                        <p className="ps-tx-row__date">{t.date}</p>
                                    </div>
                                    <span className={`ps-tx-row__amount ${t.amount.startsWith('+') ? 'pos' : 'neg'}`}>{t.amount}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── ACTIVITY LOG ── */}
                {activeSection === 'activity' && (
                    <div className="ps-section">
                        <h2 className="ps-section__title">Activity Log</h2>
                        <p className="ps-section__sub">A record of all your recent platform actions.</p>

                        <div className="ps-activity-list">
                            {[
                                { icon: '💰', text: 'Placed bid of $42,500 on Rolex Daytona', time: '2 minutes ago', type: 'bid' },
                                { icon: '🏆', text: 'Won auction — Ferrari 458 Italia', time: '3 hours ago', type: 'win' },
                                { icon: '⚠️', text: 'Outbid on Abstract Composition #7', time: '5 hours ago', type: 'outbid' },
                                { icon: '💳', text: 'Deposited $25,000 to escrow wallet', time: '1 day ago', type: 'deposit' },
                                { icon: '🔍', text: 'Watched: Banksy Original — Girl with Balloon', time: '2 days ago', type: 'watch' },
                                { icon: '🆕', text: 'Account registered & verified', time: 'Oct 1, 2024', type: 'account' },
                            ].map((a, i) => (
                                <div key={i} className={`ps-activity-item ps-activity-item--${a.type}`}>
                                    <span className="ps-activity-item__icon">{a.icon}</span>
                                    <div className="ps-activity-item__body">
                                        <p className="ps-activity-item__text">{a.text}</p>
                                        <p className="ps-activity-item__time">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
