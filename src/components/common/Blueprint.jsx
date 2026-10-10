import React, { useState } from 'react';

const TABS = ['Overview', 'Backend', 'Frontend', 'Database', 'WebSocket', 'Security'];

const CONTENT = {
    Overview: {
        title: '🏗️ System Architecture',
        desc: 'AuctionFlow is a full-stack enterprise auction platform built on Spring Boot 3.x and React 18. The system follows a clean layered architecture with JWT authentication, real-time WebSocket bidding, automated proxy bids, Stripe escrow payments, and Flyway database migrations.',
        code: `auction-platform/
├── pom.xml                     # Maven Spring Boot 3.3 config
├── src/main/java/com/auction/
│   ├── config/                 # Security, CORS, WebSocket, Swagger
│   ├── controller/             # REST API endpoints  
│   ├── service/                # Business logic layer
│   ├── repository/             # Spring Data JPA repos
│   ├── entity/                 # JPA entities (8 tables)
│   ├── dto/                    # Request/Response DTOs
│   ├── security/               # JWT filter, UserDetailsService
│   ├── websocket/              # STOMP handler, bid broadcast
│   └── scheduler/              # Auction auto-end scheduler
└── frontend/
    ├── src/
    │   ├── components/         # React UI components
    │   ├── redux/              # Redux Toolkit state
    │   ├── services/           # Axios + WebSocket clients
    │   └── utils/              # Formatters, helpers
    └── vite.config.js`
    },
    Backend: {
        title: '🚀 Spring Boot Backend',
        desc: 'Controllers, Services, Repositories organized in a clean layered architecture.',
        code: `// AuctionController.java
@RestController
@RequestMapping("/api/v1/auctions")
public class AuctionController {

    @GetMapping("/public/active")
    public ResponseEntity<List<AuctionDto>> getActiveAuctions() {
        return ResponseEntity.ok(auctionService.getActiveAuctions());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<AuctionDto> createAuction(
        @Valid @RequestBody CreateAuctionRequest req,
        @AuthenticationPrincipal UserDetails user
    ) {
        return ResponseEntity.created(null).body(
            auctionService.createAuction(req, user.getUsername())
        );
    }
}

// BidController.java
@RestController
@RequestMapping("/api/v1/bids")
public class BidController {

    @PostMapping("/place")
    @PreAuthorize("hasRole('BUYER') or hasRole('ADMIN')")
    public ResponseEntity<BidDto> placeBid(@RequestBody PlaceBidRequest req) {
        BidDto bid = bidService.placeBid(req);
        // Broadcast to STOMP /topic/auction/{id}
        messagingTemplate.convertAndSend(
            "/topic/auction/" + req.getAuctionId(), bid
        );
        return ResponseEntity.ok(bid);
    }
}`
    },
    Frontend: {
        title: '⚛️ React Frontend Stack',
        desc: 'Built with React 18, Redux Toolkit, Vite, and STOMP WebSocket integration.',
        code: `// websocketService.js — STOMP over SockJS
const wsService = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws/auction'),
  reconnectDelay: 5000,
  onConnect: () => {
    client.subscribe('/topic/auction/123', (msg) => {
      dispatch(updateBid(JSON.parse(msg.body)));
    });
  }
});

// auctionSlice.js — Redux Toolkit
const auctionSlice = createSlice({
  name: 'auction',
  reducers: {
    updateBid(state, { payload: { auctionId, amount, bidderUsername } }) {
      const item = state.auctions.find(a => a.id === auctionId);
      if (item) {
        item.currentHighestBid = amount;
        item.currentHighestBidderUsername = bidderUsername;
        item.totalBids++;
      }
    }
  }
});

// api.js — Axios interceptor with JWT auth
const api = axios.create({ baseURL: 'http://localhost:8080/api/v1' });
api.interceptors.request.use(cfg => {
  cfg.headers.Authorization = \`Bearer \${localStorage.getItem('token')}\`;
  return cfg;
});`
    },
    Database: {
        title: '🗄️ MySQL Schema',
        desc: '8 core tables managed with Flyway migrations. Indexed for high-frequency bidding queries.',
        code: `-- V1__init_schema.sql
CREATE TABLE auctions (
  id                         BIGINT AUTO_INCREMENT PRIMARY KEY,
  item_id                    BIGINT NOT NULL UNIQUE,
  seller_id                  BIGINT NOT NULL,
  current_highest_bid        DECIMAL(15,2) DEFAULT 0.00,
  current_highest_bidder_id  BIGINT,
  start_time                 TIMESTAMP NOT NULL,
  end_time                   TIMESTAMP NOT NULL,
  status                     VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  total_bids                 INT DEFAULT 0,
  CONSTRAINT fk_auctions_item   FOREIGN KEY (item_id) REFERENCES items(id),
  CONSTRAINT fk_auctions_seller FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE TABLE bids (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  auction_id  BIGINT NOT NULL,
  bidder_id   BIGINT NOT NULL,
  amount      DECIMAL(15,2) NOT NULL,
  is_auto_bid BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_bid_positive CHECK (amount > 0)
);

-- V2__add_indexes.sql  
CREATE INDEX idx_auctions_status  ON auctions(status);
CREATE INDEX idx_auctions_end_time ON auctions(end_time);
CREATE INDEX idx_bids_auction      ON bids(auction_id, created_at DESC);`
    },
    WebSocket: {
        title: '⚡ WebSocket Real-Time Architecture',
        desc: 'STOMP protocol over SockJS with Spring WebSocket for sub-second bid broadcasting.',
        code: `// WebSocketConfig.java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void configureMessageBroker(MessageBrokerRegistry reg) {
    reg.enableSimpleBroker("/topic", "/queue");
    reg.setApplicationDestinationPrefixes("/app");
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry reg) {
    reg.addEndpoint("/ws/auction")
       .setAllowedOriginPatterns("http://localhost:*")
       .withSockJS();
  }
}

// Bid broadcast sequence:
// 1. POST /api/v1/bids/place  →  BidController
// 2. BidService validates amount > currentHighestBid
// 3. BidService saves bid to DB, updates auction
// 4. messagingTemplate.convertAndSend("/topic/auction/{id}", bidDto)
// 5. All subscribed clients receive update via STOMP
// 6. Frontend dispatch(updateBid(payload)) → Redux state update → React re-render`
    },
    Security: {
        title: '🔐 JWT Security Architecture',
        desc: 'Spring Security 6 with stateless JWT authentication and role-based authorization.',
        code: `// SecurityConfig.java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
      .csrf(AbstractHttpConfigurer::disable)
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/v1/auth/**").permitAll()
        .requestMatchers("/api/v1/auctions/public/**").permitAll()
        .requestMatchers("/ws/**").permitAll()
        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated()
      )
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}

// JWT Token structure
// Header: { "alg": "HS256", "typ": "JWT" }
// Payload: { "sub": "alex_bidder", "role": "BUYER", 
//            "iat": 1727986800, "exp": 1728073200 }
// Signed with 256-bit HMAC secret`
    }
};

export default function Blueprint() {
    const [activeTab, setActiveTab] = useState('Overview');
    const content = CONTENT[activeTab];

    return (
        <div className="blueprint-wrap">
            <div>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 800 }}>📐 Code & Architecture Explorer</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>Deep-dive into the AuctionFlow platform's technical design, patterns, and code.</p>
            </div>

            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {TABS.map(tab => (
                    <button
                        key={tab}
                        className={`cat-pill ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="table-panel">
                <h2>{content.title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.75rem 0 1.25rem 0', lineHeight: 1.7 }}>{content.desc}</p>
                <pre className="code-box">{content.code}</pre>
            </div>

            {/* API Reference */}
            <div className="table-panel">
                <h2>📡 REST API Endpoints</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th>Endpoint</th>
                            <th>Auth Required</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['POST', '/api/v1/auth/register', 'None', 'User registration'],
                            ['POST', '/api/v1/auth/login', 'None', 'JWT token issue'],
                            ['GET', '/api/v1/auctions/public/active', 'None', 'List active auctions'],
                            ['GET', '/api/v1/auctions/public/:id', 'None', 'Get auction details'],
                            ['POST', '/api/v1/auctions/create', 'SELLER/ADMIN', 'Create new auction'],
                            ['POST', '/api/v1/bids/place', 'BUYER/ADMIN', 'Place bid'],
                            ['GET', '/api/v1/bids/auction/:id', 'JWT', 'Get bid history'],
                            ['GET', '/api/v1/users/profile', 'JWT', 'Get user profile'],
                            ['GET', '/api/v1/admin/stats', 'ADMIN', 'Platform statistics'],
                        ].map(([method, endpoint, auth, desc], i) => (
                            <tr key={i}>
                                <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', fontWeight: 700, color: method === 'GET' ? '#34d399' : '#818cf8' }}>{method}</span></td>
                                <td><span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: '#f8fafc' }}>{endpoint}</span></td>
                                <td><span style={{ fontSize: '0.78rem', color: auth === 'None' ? '#94a3b8' : '#f59e0b', fontWeight: 600 }}>{auth}</span></td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
