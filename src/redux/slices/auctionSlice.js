import { createSlice } from '@reduxjs/toolkit';

const initialSampleAuctions = [
    {
        id: 1,
        title: 'Rolex Cosmograph Daytona 116500LN "Panda" Dial',
        category: 'Watches',
        status: 'ACTIVE',
        condition: 'MINT / UNWORN',
        startingPrice: 18000,
        currentHighestBid: 32500,
        reservePrice: 28000,
        minIncrement: 500,
        totalBids: 28,
        primaryImageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
        ],
        startTime: new Date(Date.now() - 3600000 * 24).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 3.5).toISOString(),
        currentHighestBidderUsername: 'marcus_chen',
        sellerUsername: 'victor_chronos',
        sellerRating: 4.95,
        description: 'Original box, papers, green tag and bezel protector. Ceramic Cerachrom bezel, 4130 automatic movement with 72h power reserve. 100% authentic verified by ChronoExperts.',
        bidsHistory: [
            { id: 101, bidder: 'marcus_chen', amount: 32500, time: '2 mins ago', isWinning: true },
            { id: 102, bidder: 'alex_bidder', amount: 32000, time: '14 mins ago', isWinning: false },
            { id: 103, bidder: 'sophia_collector', amount: 31000, time: '42 mins ago', isWinning: false },
            { id: 104, bidder: 'david_k', amount: 29500, time: '2 hours ago', isWinning: false }
        ]
    },
    {
        id: 2,
        title: '1967 Shelby GT500 "Eleanor" Fastback 428 Cobra Jet',
        category: 'Vehicles',
        status: 'ACTIVE',
        condition: 'CONCOURS RESTORED',
        startingPrice: 95000,
        currentHighestBid: 168000,
        reservePrice: 150000,
        minIncrement: 2000,
        totalBids: 41,
        primaryImageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
        ],
        startTime: new Date(Date.now() - 3600000 * 48).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 18).toISOString(),
        currentHighestBidderUsername: 'racer_x',
        sellerUsername: 'heritage_motors',
        sellerRating: 4.98,
        description: 'Matching numbers 428ci Police Interceptor V8, dual 4-barrel Holley carburetors, Toploader 4-speed manual gearbox, Pepper Gray with black Le Mans stripes.',
        bidsHistory: [
            { id: 201, bidder: 'racer_x', amount: 168000, time: '8 mins ago', isWinning: true },
            { id: 202, bidder: 'alex_bidder', amount: 166000, time: '35 mins ago', isWinning: false },
            { id: 203, bidder: 'vance_capital', amount: 160000, time: '3 hours ago', isWinning: false }
        ]
    },
    {
        id: 3,
        title: 'Pablo Picasso - "Colombe de la Paix" Original Lithograph (1949)',
        category: 'Art',
        status: 'ACTIVE',
        condition: 'MUSEUM ARCHIVAL',
        startingPrice: 12000,
        currentHighestBid: 24750,
        reservePrice: 20000,
        minIncrement: 250,
        totalBids: 19,
        primaryImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80'
        ],
        startTime: new Date(Date.now() - 3600000 * 12).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 1.2).toISOString(),
        currentHighestBidderUsername: 'gallery_geneva',
        sellerUsername: 'artisan_vault',
        sellerRating: 5.0,
        description: 'Hand-signed in pencil lower right by Pablo Picasso, numbered 42/75. Provenance certificate from Galerie Louise Leiris, Paris. Preserved in UV museum glass.',
        bidsHistory: [
            { id: 301, bidder: 'gallery_geneva', amount: 24750, time: '1 min ago', isWinning: true },
            { id: 302, bidder: 'elena_rolex', amount: 24500, time: '20 mins ago', isWinning: false }
        ]
    },
    {
        id: 4,
        title: '5.20 Carat Vivid Royal Blue Sapphire & Platinum Ring',
        category: 'Jewelry',
        status: 'ACTIVE',
        condition: 'NEW / CERTIFIED',
        startingPrice: 35000,
        currentHighestBid: 51200,
        reservePrice: 48000,
        minIncrement: 1000,
        totalBids: 15,
        primaryImageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
        ],
        startTime: new Date(Date.now() - 3600000 * 6).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 29).toISOString(),
        currentHighestBidderUsername: 'lady_monaco',
        sellerUsername: 'cartier_privé',
        sellerRating: 4.92,
        description: 'Unheated Ceylon natural sapphire certified by Gübelin Gem Lab. Flanked by two trapezoid-cut DEF VS1 diamonds totaling 1.40 carats, crafted in 950 Platinum.',
        bidsHistory: [
            { id: 401, bidder: 'lady_monaco', amount: 51200, time: '5 mins ago', isWinning: true },
            { id: 402, bidder: 'marcus_chen', amount: 50000, time: '1 hour ago', isWinning: false }
        ]
    },
    {
        id: 5,
        title: 'The Macallan 1950 Exceptional Single Cask 52-Year-Old Whisky',
        category: 'Collectibles',
        status: 'ACTIVE',
        condition: 'SEALED VAULT BOTTLE',
        startingPrice: 40000,
        currentHighestBid: 68500,
        reservePrice: 65000,
        minIncrement: 500,
        totalBids: 23,
        primaryImageUrl: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=800&q=80'
        ],
        startTime: new Date(Date.now() - 3600000 * 30).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 6.5).toISOString(),
        currentHighestBidderUsername: 'highland_spirit',
        sellerUsername: 'rare_cask_co',
        sellerRating: 4.88,
        description: 'Distilled at Macallan in 1950 and matured in a first-fill European oak sherry butt. Bottled at cask strength 48.2% ABV in hand-blown crystal decanter with solid oak presentation box.',
        bidsHistory: [
            { id: 501, bidder: 'highland_spirit', amount: 68500, time: '12 mins ago', isWinning: true },
            { id: 502, bidder: 'vance_capital', amount: 68000, time: '50 mins ago', isWinning: false }
        ]
    },
    {
        id: 6,
        title: 'Bored Ape Yacht Club #8817 (Gold Fur Edition)',
        category: 'Digital Art',
        status: 'ACTIVE',
        condition: 'VERIFIED ON-CHAIN',
        startingPrice: 60000,
        currentHighestBid: 82000,
        reservePrice: 80000,
        minIncrement: 1000,
        totalBids: 32,
        primaryImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
        ],
        startTime: new Date(Date.now() - 3600000 * 8).toISOString(),
        endTime: new Date(Date.now() + 3600000 * 12).toISOString(),
        currentHighestBidderUsername: 'satoshi_vault',
        sellerUsername: 'crypto_punker',
        sellerRating: 4.79,
        description: 'Ultra-rare Solid Gold Fur trait (<1% rarity score). Smart contract verified on Ethereum mainnet. Includes commercial IP rights and VIP metaverse club membership.',
        bidsHistory: [
            { id: 601, bidder: 'satoshi_vault', amount: 82000, time: '4 mins ago', isWinning: true },
            { id: 602, bidder: 'marcus_chen', amount: 81000, time: '30 mins ago', isWinning: false }
        ]
    }
];

const initialState = {
    auctions: initialSampleAuctions,
    selectedAuction: null,
    selectedCategory: 'ALL',
    searchQuery: '',
    sortBy: 'ENDING_SOON',
    loading: false,
    error: null,
    liveFeed: [
        { id: 1, text: 'Marcus Chen placed a bid of $32,500 on Rolex Daytona', time: '2m ago', type: 'BID' },
        { id: 2, text: 'Racer X raised bid to $168,000 on 1967 Shelby GT500', time: '8m ago', type: 'BID' },
        { id: 3, text: 'Reserve price met for Picasso "Colombe de la Paix"', time: '15m ago', type: 'RESERVE_MET' }
    ]
};

const auctionSlice = createSlice({
    name: 'auction',
    initialState,
    reducers: {
        setAuctions(state, action) {
            state.auctions = action.payload;
        },
        setSelectedAuction(state, action) {
            state.selectedAuction = action.payload;
        },
        clearSelectedAuction(state) {
            state.selectedAuction = null;
        },
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        },
        setSortBy(state, action) {
            state.sortBy = action.payload;
        },
        updateBid(state, action) {
            const { auctionId, amount, bidderUsername } = action.payload;
            const item = state.auctions.find(a => a.id === auctionId);
            const newBidRecord = {
                id: Date.now(),
                bidder: bidderUsername,
                amount: amount,
                time: 'Just now',
                isWinning: true
            };

            if (item) {
                item.currentHighestBid = amount;
                item.currentHighestBidderUsername = bidderUsername;
                item.totalBids = (item.totalBids || 0) + 1;
                if (!item.bidsHistory) item.bidsHistory = [];
                item.bidsHistory.forEach(b => { b.isWinning = false; });
                item.bidsHistory.unshift(newBidRecord);
            }

            // Sync with currently open auction detail modal so user sees immediate live update
            if (state.selectedAuction && state.selectedAuction.id === auctionId) {
                state.selectedAuction.currentHighestBid = amount;
                state.selectedAuction.currentHighestBidderUsername = bidderUsername;
                state.selectedAuction.totalBids = (state.selectedAuction.totalBids || 0) + 1;
                if (!state.selectedAuction.bidsHistory) state.selectedAuction.bidsHistory = [];
                state.selectedAuction.bidsHistory.forEach(b => { b.isWinning = false; });
                state.selectedAuction.bidsHistory.unshift(newBidRecord);
            }

            // Append to platform live ticker
            state.liveFeed.unshift({
                id: Date.now(),
                text: `${bidderUsername} placed bid of $${amount.toLocaleString()} on ${item ? item.title : 'Auction #' + auctionId}`,
                time: 'Just now',
                type: 'BID'
            });
            if (state.liveFeed.length > 20) state.liveFeed.pop();
        },
        createAuction(state, action) {
            const newAuction = {
                id: Date.now(),
                status: 'ACTIVE',
                totalBids: 0,
                currentHighestBid: action.payload.startingPrice,
                currentHighestBidderUsername: null,
                bidsHistory: [],
                ...action.payload
            };
            state.auctions.unshift(newAuction);
            state.liveFeed.unshift({
                id: Date.now(),
                text: `New auction launched: ${newAuction.title} by ${newAuction.sellerUsername}`,
                time: 'Just now',
                type: 'NEW_AUCTION'
            });
        },
        endAuction(state, action) {
            const auctionId = action.payload;
            const item = state.auctions.find(a => a.id === auctionId);
            if (item) {
                item.status = 'ENDED';
            }
            if (state.selectedAuction && state.selectedAuction.id === auctionId) {
                state.selectedAuction.status = 'ENDED';
            }
        },
        deleteAuction(state, action) {
            const auctionId = action.payload;
            state.auctions = state.auctions.filter(a => a.id !== auctionId);
            if (state.selectedAuction && state.selectedAuction.id === auctionId) {
                state.selectedAuction = null;
            }
        }
    }
});

export const {
    setAuctions,
    setSelectedAuction,
    clearSelectedAuction,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    updateBid,
    createAuction,
    endAuction,
    deleteAuction
} = auctionSlice.actions;

export default auctionSlice.reducer;
