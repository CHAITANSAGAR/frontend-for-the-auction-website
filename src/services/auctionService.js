import api from './api';

export const getActiveAuctions = () => api.get('/auctions/public/active');
export const getAuctionById = (id) => api.get(`/auctions/public/${id}`);
export const createAuction = (data) => api.post('/auctions/create', data);
