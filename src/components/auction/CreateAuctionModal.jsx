import React, { useState } from 'react';

const CATEGORIES = ['Watches', 'Vehicles', 'Art', 'Jewelry', 'Collectibles', 'Digital Art', 'Electronics', 'Real Estate'];
const CONDITIONS = ['MINT / UNWORN', 'LIKE NEW', 'EXCELLENT', 'GOOD', 'FAIR'];

export default function CreateAuctionModal({ onClose, onCreate }) {
    const [form, setForm] = useState({
        title: '',
        category: 'Watches',
        condition: 'EXCELLENT',
        description: '',
        primaryImageUrl: '',
        startingPrice: '',
        reservePrice: '',
        minIncrement: '500',
        endTime: '',
    });

    const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.startingPrice || !form.endTime) {
            alert('Please fill in all required fields.');
            return;
        }
        onCreate({
            ...form,
            startingPrice: parseFloat(form.startingPrice),
            reservePrice: parseFloat(form.reservePrice || form.startingPrice),
            minIncrement: parseFloat(form.minIncrement || 500),
            currentHighestBid: parseFloat(form.startingPrice),
            startTime: new Date().toISOString(),
            primaryImageUrl: form.primaryImageUrl || 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80',
        });
    };

    const inputStyle = {
        width: '100%',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-subtle)',
        color: '#ffffff',
        padding: '0.65rem 0.9rem',
        borderRadius: '8px',
        fontSize: '0.875rem',
        outline: 'none',
        fontFamily: 'Inter, sans-serif',
    };

    const labelStyle = {
        fontSize: '0.78rem',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.35rem',
        display: 'block',
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>
                <div style={{ padding: '2rem' }}>
                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>🚀 Create New Auction</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>Fill in the details to launch your auction on the platform.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                            <label style={labelStyle}>Item Title *</label>
                            <input style={inputStyle} placeholder="e.g. Rolex Daytona 116500LN" value={form.title} onChange={e => handleChange('title', e.target.value)} required />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={labelStyle}>Category</label>
                                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => handleChange('category', e.target.value)}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Condition</label>
                                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.condition} onChange={e => handleChange('condition', e.target.value)}>
                                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Description</label>
                            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', lineHeight: 1.6 }} placeholder="Describe the item's authenticity, provenance, and condition..." value={form.description} onChange={e => handleChange('description', e.target.value)} />
                        </div>

                        <div>
                            <label style={labelStyle}>Primary Image URL (optional)</label>
                            <input style={inputStyle} placeholder="https://..." value={form.primaryImageUrl} onChange={e => handleChange('primaryImageUrl', e.target.value)} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                            <div>
                                <label style={labelStyle}>Starting Price *</label>
                                <input style={inputStyle} type="number" placeholder="$" value={form.startingPrice} onChange={e => handleChange('startingPrice', e.target.value)} required />
                            </div>
                            <div>
                                <label style={labelStyle}>Reserve Price</label>
                                <input style={inputStyle} type="number" placeholder="$" value={form.reservePrice} onChange={e => handleChange('reservePrice', e.target.value)} />
                            </div>
                            <div>
                                <label style={labelStyle}>Min Increment</label>
                                <input style={inputStyle} type="number" value={form.minIncrement} onChange={e => handleChange('minIncrement', e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Auction End Date & Time *</label>
                            <input style={inputStyle} type="datetime-local" value={form.endTime} onChange={e => handleChange('endTime', e.target.value)} required />
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button type="button" onClick={onClose} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: '#94a3b8', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
                                Cancel
                            </button>
                            <button type="submit" style={{ flex: 2, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
                                🚀 Launch Auction
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
