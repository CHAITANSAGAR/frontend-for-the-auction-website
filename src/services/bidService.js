import api from './api';

export const placeBid = (auctionId, amount, isAutoBid = false) =>
    api.post('/bids/place', { auctionId, amount, isAutoBid });
export const getBidHistory = (auctionId) => api.get(`/bids/auction/${auctionId}`);
