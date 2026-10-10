import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WS_BASE_URL } from '../config/apiConfig';

class WebSocketService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.subscriptions = new Map();
        this.simInterval = null;
    }

    connect(onConnected, onError) {
        try {
            // Convert ws:// to http:// for SockJS fallback
            const sockJsUrl = WS_BASE_URL.replace(/^ws:\/\//i, 'http://').replace(/^wss:\/\//i, 'https://');
            
            this.client = new Client({
                webSocketFactory: () => new SockJS(sockJsUrl),
                reconnectDelay: 8000,
                debug: (str) => {
                    // Silent in production
                },
                onConnect: () => {
                    this.isConnected = true;
                    if (onConnected) onConnected(this.client);
                },
                onStompError: (frame) => {
                    console.warn('STOMP protocol error:', frame.headers['message']);
                    if (onError) onError(frame);
                },
                onWebSocketClose: () => {
                    this.isConnected = false;
                }
            });

            this.client.activate();
        } catch (err) {
            console.warn('WebSocket connection init failed, operating in autonomous simulation mode:', err);
            if (onError) onError(err);
        }
    }

    subscribeToAuction(auctionId, callback) {
        if (this.client && this.isConnected) {
            const sub = this.client.subscribe(`/topic/auction/${auctionId}`, (message) => {
                try {
                    callback(JSON.parse(message.body));
                } catch (e) {
                    console.error('Failed to parse WS message:', e);
                }
            });
            this.subscriptions.set(auctionId, sub);
            return sub;
        }
        return null;
    }

    unsubscribeFromAuction(auctionId) {
        const sub = this.subscriptions.get(auctionId);
        if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(auctionId);
        }
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.isConnected = false;
        }
        if (this.simInterval) {
            clearInterval(this.simInterval);
        }
    }
}

export default new WebSocketService();
