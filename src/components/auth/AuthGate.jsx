import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';

const DEFAULT_ACCOUNTS = [
    {
        id: 4,
        username: 'alex_bidder',
        fullName: 'Alexander Wright',
        email: 'buyer@demo.com',
        password: 'Buyer@123',
        role: 'BUYER',
        balance: 58500.00,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        verified: true
    },
    {
        id: 2,
        username: 'victor_seller',
        fullName: 'Victor Vance',
        email: 'seller@demo.com',
        password: 'Seller@123',
        role: 'SELLER',
        balance: 142000.00,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        verified: true
    },
    {
        id: 1,
        username: 'admin',
        fullName: 'Platform Admin',
        email: 'admin@demo.com',
        password: 'Admin@123',
        role: 'ADMIN',
        balance: 950000.00,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        verified: true
    }
];

export default function AuthGate() {
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup' | 'forgot'
    const [selectedRole, setSelectedRole] = useState('BUYER');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('buyer@demo.com');
    const [loginPassword, setLoginPassword] = useState('Buyer@123');

    // Sign Up Form State
    const [signUpRole, setSignUpRole] = useState('BUYER');
    const [signUpFullName, setSignUpFullName] = useState('');
    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
    const [signUpBalance, setSignUpBalance] = useState(25000);
    const [signUpAgreed, setSignUpAgreed] = useState(true);

    // Forgot Password Form State
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [generatedCode, setGeneratedCode] = useState('VAULT-8821');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handleRoleTabSelect = (role) => {
        setSelectedRole(role);
        setErrorMessage('');
        if (role === 'BUYER') {
            setLoginEmail('buyer@demo.com');
            setLoginPassword('Buyer@123');
        } else if (role === 'SELLER') {
            setLoginEmail('seller@demo.com');
            setLoginPassword('Seller@123');
        } else if (role === 'ADMIN') {
            setLoginEmail('admin@demo.com');
            setLoginPassword('Admin@123');
        }
    };

    const handleQuickLogin = (role) => {
        const found = DEFAULT_ACCOUNTS.find(a => a.role === role);
        if (found) {
            dispatch(setCredentials({
                user: found,
                token: `jwt_token_${found.username}_${Date.now()}`
            }));
        }
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        const email = loginEmail.trim().toLowerCase();
        const pwd = loginPassword;

        // Check in localStorage users or default
        let users = DEFAULT_ACCOUNTS;
        try {
            const storedUsers = localStorage.getItem('auctionflow_users_db');
            if (storedUsers) {
                users = JSON.parse(storedUsers);
            }
        } catch (err) {}

        const user = users.find(u => u.email.toLowerCase() === email && u.password === pwd);
        if (!user) {
            setErrorMessage('Invalid credentials. Check your email & password or use 1-Click Demo Login below.');
            return;
        }

        dispatch(setCredentials({
            user: user,
            token: `jwt_token_${user.username}_${Date.now()}`
        }));
    };

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!signUpFullName.trim() || !signUpUsername.trim() || !signUpEmail.trim() || !signUpPassword) {
            setErrorMessage('Please fill out all required fields.');
            return;
        }

        if (signUpPassword.length < 6) {
            setErrorMessage('Password must be at least 6 characters.');
            return;
        }

        if (signUpPassword !== signUpConfirmPassword) {
            setErrorMessage('Passwords do not match. Please re-enter.');
            return;
        }

        let users = [...DEFAULT_ACCOUNTS];
        try {
            const stored = localStorage.getItem('auctionflow_users_db');
            if (stored) users = JSON.parse(stored);
        } catch (err) {}

        const exists = users.find(u => u.email.toLowerCase() === signUpEmail.trim().toLowerCase() || u.username.toLowerCase() === signUpUsername.trim().toLowerCase());
        if (exists) {
            setErrorMessage('An account with this email or username already exists. Please sign in.');
            return;
        }

        const newUser = {
            id: Date.now(),
            username: signUpUsername.trim().replace(/^@/, ''),
            fullName: signUpFullName.trim(),
            email: signUpEmail.trim().toLowerCase(),
            password: signUpPassword,
            role: signUpRole,
            balance: parseFloat(signUpBalance),
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            verified: true
        };

        users.push(newUser);
        try {
            localStorage.setItem('auctionflow_users_db', JSON.stringify(users));
        } catch (err) {}

        dispatch(setCredentials({
            user: newUser,
            token: `jwt_token_${newUser.username}_${Date.now()}`
        }));
    };

    const handleForgotStep1 = (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (!forgotEmail.trim()) {
            setErrorMessage('Please enter your email address.');
            return;
        }

        const code = `VAULT-${Math.floor(1000 + Math.random() * 9000)}`;
        setGeneratedCode(code);
        setForgotStep(2);
    };

    const handleForgotStep2 = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (verificationCode.trim().toUpperCase() !== generatedCode) {
            setErrorMessage('Invalid verification code. Please check or click Autofill.');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage('New password must be at least 6 characters.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setErrorMessage('New passwords do not match. Please re-enter.');
            return;
        }

        // Update in DB
        try {
            const stored = localStorage.getItem('auctionflow_users_db');
            let users = stored ? JSON.parse(stored) : [...DEFAULT_ACCOUNTS];
            const idx = users.findIndex(u => u.email.toLowerCase() === forgotEmail.trim().toLowerCase());
            if (idx !== -1) {
                users[idx].password = newPassword;
                localStorage.setItem('auctionflow_users_db', JSON.stringify(users));
            }
        } catch (err) {}

        setLoginEmail(forgotEmail);
        setLoginPassword(newPassword);
        setActiveTab('login');
        setForgotStep(1);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            background: 'radial-gradient(circle at 50% 10%, rgba(99, 102, 241, 0.2) 0%, transparent 60%), radial-gradient(circle at 80% 90%, rgba(16, 185, 129, 0.12) 0%, transparent 50%), #07090e',
            color: '#ffffff',
            position: 'relative'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '540px',
                background: 'rgba(13, 18, 30, 0.94)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '24px',
                padding: '2.25rem',
                backdropFilter: 'blur(28px)',
                boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.18)'
            }}>
                {/* Brand Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '50px',
                        height: '50px',
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                        boxShadow: '0 0 25px rgba(99, 102, 241, 0.35)',
                        fontSize: '1.5rem',
                        marginBottom: '0.75rem'
                    }}>
                        🏛️
                    </div>
                    <h1 style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '1.65rem',
                        fontWeight: 800,
                        letterSpacing: '-0.5px',
                        marginBottom: '0.25rem'
                    }}>
                        AUCTION<span style={{ color: '#818cf8' }}>FLOW</span>
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            color: '#34d399'
                        }}>
                            ● SECURE LIVE GATEWAY
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>React + Redux + STOMP</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px',
                        fontSize: '0.72rem',
                        color: '#64748b',
                        marginTop: '0.5rem'
                    }}>
                        <span>🔒 256-Bit Escrow</span>
                        <span>•</span>
                        <span>⚡ Real-Time Floor</span>
                        <span>•</span>
                        <span>🛡️ Anti-Sniping</span>
                    </div>
                </div>

                {/* Mode Navigation Tabs */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '4px',
                    marginBottom: '1.5rem',
                    gap: '4px'
                }}>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                        style={{
                            flex: 1,
                            background: activeTab === 'login' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                            color: activeTab === 'login' ? '#ffffff' : '#94a3b8',
                            border: 'none',
                            padding: '9px 12px',
                            borderRadius: '9px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('signup'); setErrorMessage(''); }}
                        style={{
                            flex: 1,
                            background: activeTab === 'signup' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                            color: activeTab === 'signup' ? '#ffffff' : '#94a3b8',
                            border: 'none',
                            padding: '9px 12px',
                            borderRadius: '9px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Create Account
                    </button>
                    <button
                        type="button"
                        onClick={() => { setActiveTab('forgot'); setErrorMessage(''); }}
                        style={{
                            flex: 1,
                            background: activeTab === 'forgot' ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' : 'transparent',
                            color: activeTab === 'forgot' ? '#ffffff' : '#94a3b8',
                            border: 'none',
                            padding: '9px 12px',
                            borderRadius: '9px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Forgot Password
                    </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#fca5a5',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        marginBottom: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>⚠️</span>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* ================= TAB 1: LOGIN ================= */}
                {activeTab === 'login' && (
                    <div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.2rem' }}>Welcome Back</h3>
                            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Select your workspace role or enter your registered account credentials.</p>
                        </div>

                        {/* Quick Role Switcher */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.2rem' }}>
                            {['BUYER', 'SELLER', 'ADMIN'].map(role => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleRoleTabSelect(role)}
                                    style={{
                                        background: selectedRole === role ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                                        borderColor: selectedRole === role ? '#6366f1' : 'rgba(255, 255, 255, 0.09)',
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderRadius: '10px',
                                        padding: '8px',
                                        color: selectedRole === role ? '#a5b4fc' : '#94a3b8',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {role === 'BUYER' ? '💎 Buyer' : role === 'SELLER' ? '💼 Seller' : '🛡️ Admin'}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleLoginSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    placeholder="you@domain.com"
                                    required
                                    style={{
                                        width: '100%',
                                        background: 'rgba(9, 13, 22, 0.85)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        borderRadius: '10px',
                                        color: '#ffffff',
                                        padding: '11px 14px',
                                        fontSize: '0.9rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                        placeholder="Enter password"
                                        required
                                        style={{
                                            width: '100%',
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            borderRadius: '10px',
                                            color: '#ffffff',
                                            padding: '11px 40px 11px 14px',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            color: '#94a3b8'
                                        }}
                                    >
                                        {showPassword ? '🔒' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', fontSize: '0.8rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', cursor: 'pointer' }}>
                                    <input type="checkbox" defaultChecked style={{ accentColor: '#6366f1' }} />
                                    <span>Keep me signed in</span>
                                </label>
                                <span onClick={() => setActiveTab('forgot')} style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>
                                    Forgot password?
                                </span>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
                                    border: 'none',
                                    borderRadius: '11px',
                                    color: '#ffffff',
                                    fontFamily: 'Outfit, sans-serif',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    padding: '13px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)'
                                }}
                            >
                                Sign In to Live Floor ➔
                            </button>
                        </form>

                        {/* 1-Click Fast Pass Instant Demo Access */}
                        <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                                <span>⚡ 1-Click Instant Demo Login</span>
                                <span style={{ color: '#818cf8' }}>No typing needed</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                <div
                                    onClick={() => handleQuickLogin('BUYER')}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '10px',
                                        padding: '9px 6px',
                                        textAlign: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>💎 Marcus Chen</div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>buyer@demo.com</div>
                                    <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>$58.5k Escrow</div>
                                </div>
                                <div
                                    onClick={() => handleQuickLogin('SELLER')}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '10px',
                                        padding: '9px 6px',
                                        textAlign: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>💼 Victor Vance</div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>seller@demo.com</div>
                                    <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>Consignor</div>
                                </div>
                                <div
                                    onClick={() => handleQuickLogin('ADMIN')}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid rgba(255, 255, 255, 0.08)',
                                        borderRadius: '10px',
                                        padding: '9px 6px',
                                        textAlign: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>🛡️ System Admin</div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>admin@demo.com</div>
                                    <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>Supervision</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                            New to AuctionFlow?{' '}
                            <span onClick={() => setActiveTab('signup')} style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>
                                Create an account
                            </span>
                        </div>
                    </div>
                )}

                {/* ================= TAB 2: SIGN UP ================= */}
                {activeTab === 'signup' && (
                    <div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.2rem' }}>Create VIP Account</h3>
                            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Join the live auction floor with authenticated escrow protection.</p>
                        </div>

                        {/* Account Type Selector */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.2rem' }}>
                            <div
                                onClick={() => setSignUpRole('BUYER')}
                                style={{
                                    border: signUpRole === 'BUYER' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                                    background: signUpRole === 'BUYER' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                                    borderRadius: '12px',
                                    padding: '10px 12px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '2px' }}>💎 Buyer / Collector</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Place bids, auto-proxy bidding, and secure escrow wallet.</div>
                            </div>
                            <div
                                onClick={() => setSignUpRole('SELLER')}
                                style={{
                                    border: signUpRole === 'SELLER' ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
                                    background: signUpRole === 'SELLER' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                                    borderRadius: '12px',
                                    padding: '10px 12px',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '2px' }}>💼 Consignor / Seller</div>
                                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>List luxury lots, set reserve prices, and receive verified payouts.</div>
                            </div>
                        </div>

                        <form onSubmit={handleSignUpSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={signUpFullName}
                                        onChange={e => setSignUpFullName(e.target.value)}
                                        placeholder="e.g. Alexander Wright"
                                        required
                                        style={{
                                            width: '100%',
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            borderRadius: '10px',
                                            color: '#ffffff',
                                            padding: '10px 12px',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Username</label>
                                    <input
                                        type="text"
                                        value={signUpUsername}
                                        onChange={e => setSignUpUsername(e.target.value)}
                                        placeholder="e.g. alex_collector"
                                        required
                                        style={{
                                            width: '100%',
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            borderRadius: '10px',
                                            color: '#ffffff',
                                            padding: '10px 12px',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={signUpEmail}
                                    onChange={e => setSignUpEmail(e.target.value)}
                                    placeholder="you@domain.com"
                                    required
                                    style={{
                                        width: '100%',
                                        background: 'rgba(9, 13, 22, 0.85)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        borderRadius: '10px',
                                        color: '#ffffff',
                                        padding: '10px 12px',
                                        fontSize: '0.85rem',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Password</label>
                                    <input
                                        type="password"
                                        value={signUpPassword}
                                        onChange={e => setSignUpPassword(e.target.value)}
                                        placeholder="Min. 6 chars"
                                        required
                                        style={{
                                            width: '100%',
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            borderRadius: '10px',
                                            color: '#ffffff',
                                            padding: '10px 12px',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Confirm Password</label>
                                    <input
                                        type="password"
                                        value={signUpConfirmPassword}
                                        onChange={e => setSignUpConfirmPassword(e.target.value)}
                                        placeholder="Re-type password"
                                        required
                                        style={{
                                            width: '100%',
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            borderRadius: '10px',
                                            color: '#ffffff',
                                            padding: '10px 12px',
                                            fontSize: '0.85rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Starting Escrow Wallet Credit</label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {[10000, 25000, 50000].map(amt => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setSignUpBalance(amt)}
                                            style={{
                                                flex: 1,
                                                background: signUpBalance === amt ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                                border: signUpBalance === amt ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '8px',
                                                padding: '7px',
                                                color: signUpBalance === amt ? '#34d399' : '#94a3b8',
                                                fontSize: '0.78rem',
                                                fontFamily: 'monospace',
                                                fontWeight: 700,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            +${amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.2rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={signUpAgreed}
                                        onChange={e => setSignUpAgreed(e.target.checked)}
                                        style={{ accentColor: '#6366f1' }}
                                        required
                                    />
                                    <span>I agree to Escrow Terms, Anti-Sniping Policy & Bidding Rules</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
                                    border: 'none',
                                    borderRadius: '11px',
                                    color: '#ffffff',
                                    fontFamily: 'Outfit, sans-serif',
                                    fontSize: '0.95rem',
                                    fontWeight: 700,
                                    padding: '13px',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)'
                                }}
                            >
                                Create VIP Account & Enter Platform ➔
                            </button>
                        </form>

                        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                            Already have an account?{' '}
                            <span onClick={() => setActiveTab('login')} style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>
                                Sign In
                            </span>
                        </div>
                    </div>
                )}

                {/* ================= TAB 3: FORGOT PASSWORD ================= */}
                {activeTab === 'forgot' && (
                    <div>
                        <div style={{ marginBottom: '1.2rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.2rem' }}>Reset Vault Credentials</h3>
                            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Enter your account email to receive a recovery code and reset your password.</p>
                        </div>

                        {forgotStep === 1 ? (
                            <form onSubmit={handleForgotStep1}>
                                <div style={{ marginBottom: '1.2rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Registered Email</label>
                                    <input
                                        type="email"
                                        value={forgotEmail}
                                        onChange={e => setForgotEmail(e.target.value)}
                                        placeholder="e.g. buyer@demo.com"
                                        required
                                        style={{
                                            width: '100%',
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            borderRadius: '10px',
                                            color: '#ffffff',
                                            padding: '11px 14px',
                                            fontSize: '0.9rem',
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
                                        border: 'none',
                                        borderRadius: '11px',
                                        color: '#ffffff',
                                        fontFamily: 'Outfit, sans-serif',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        padding: '13px',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)'
                                    }}
                                >
                                    Request Security Recovery Code ➔
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleForgotStep2}>
                                <div style={{
                                    background: 'rgba(99, 102, 241, 0.12)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    borderRadius: '12px',
                                    padding: '12px 14px',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>Security Code Dispatched:</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: '#34d399' }}>{generatedCode}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setVerificationCode(generatedCode)}
                                        style={{
                                            background: 'rgba(99, 102, 241, 0.25)',
                                            border: '1px solid rgba(99, 102, 241, 0.4)',
                                            color: '#ffffff',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        ⚡ Autofill
                                    </button>
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Verification Code</label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={e => setVerificationCode(e.target.value)}
                                        placeholder="e.g. VAULT-8821"
                                        required
                                        style={{
                                            width: '100%',
                                            background: 'rgba(9, 13, 22, 0.85)',
                                            border: '1px solid rgba(255, 255, 255, 0.12)',
                                            borderRadius: '10px',
                                            color: '#ffffff',
                                            padding: '10px 12px',
                                            fontSize: '0.9rem',
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.2rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            placeholder="Min. 6 chars"
                                            required
                                            style={{
                                                width: '100%',
                                                background: 'rgba(9, 13, 22, 0.85)',
                                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                                borderRadius: '10px',
                                                color: '#ffffff',
                                                padding: '10px 12px',
                                                fontSize: '0.85rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: '5px' }}>Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={e => setConfirmNewPassword(e.target.value)}
                                            placeholder="Re-type password"
                                            required
                                            style={{
                                                width: '100%',
                                                background: 'rgba(9, 13, 22, 0.85)',
                                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                                borderRadius: '10px',
                                                color: '#ffffff',
                                                padding: '10px 12px',
                                                fontSize: '0.85rem',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        width: '100%',
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #8b5cf6 100%)',
                                        border: 'none',
                                        borderRadius: '11px',
                                        color: '#ffffff',
                                        fontFamily: 'Outfit, sans-serif',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        padding: '13px',
                                        cursor: 'pointer',
                                        boxShadow: '0 8px 25px rgba(79, 70, 229, 0.4)'
                                    }}
                                >
                                    Update Password & Enter Floor ➔
                                </button>
                            </form>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                            Remembered your password?{' '}
                            <span onClick={() => { setActiveTab('login'); setForgotStep(1); }} style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}>
                                Back to Sign In
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
