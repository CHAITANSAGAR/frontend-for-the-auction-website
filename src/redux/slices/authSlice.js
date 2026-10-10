import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
    try {
        const stored = localStorage.getItem('user');
        if (stored && stored !== 'undefined') {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Failed to parse stored user:', e);
    }
    return null;
};

const getInitialToken = () => {
    try {
        return localStorage.getItem('token') || null;
    } catch (e) {
        return null;
    }
};

const initialUser = getInitialUser();
const initialToken = getInitialToken();

const initialState = {
    user: initialUser,
    token: initialToken,
    isAuthenticated: Boolean(initialUser && initialToken),
    notifications: [
        { id: 1, text: 'You have been outbid on 1967 Shelby GT500!', time: '10m ago', unread: true },
        { id: 2, text: 'Auction "Rolex Daytona 116500LN" is ending in 1 hour.', time: '25m ago', unread: true },
        { id: 3, text: 'Your bid of $14,500 on Picasso Sketch was accepted.', time: '2h ago', unread: false }
    ]
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            try {
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('token', action.payload.token);
            } catch (e) {}
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            try {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } catch (e) {}
        },
        setRole(state, action) {
            if (state.user) {
                state.user.role = action.payload;
                try {
                    localStorage.setItem('user', JSON.stringify(state.user));
                } catch (e) {}
            }
        },
        updateBalance(state, action) {
            if (state.user) {
                state.user.balance = (state.user.balance || 0) + action.payload;
                try {
                    localStorage.setItem('user', JSON.stringify(state.user));
                } catch (e) {}
            }
        },
        markNotificationsRead(state) {
            state.notifications.forEach(n => { n.unread = false; });
        },
        addNotification(state, action) {
            state.notifications.unshift({
                id: Date.now(),
                text: action.payload,
                time: 'Just now',
                unread: true
            });
        }
    }
});

export const {
    setCredentials,
    logout,
    setRole,
    updateBalance,
    markNotificationsRead,
    addNotification
} = authSlice.actions;

export default authSlice.reducer;
