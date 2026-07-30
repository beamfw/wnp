# Anti-Scraping & Resource Defense

WNP provides multi-layered defenses to prevent aggressive scraping from overwhelming server bandwidth.

## Defensive Capabilities

### 1. Token Bucket Rate Limiting (`WNPRateLimiter`)
Smooths out request spikes by evaluating tokens per IP and bot signature over sliding time windows.

### 2. Proof-of-Work Challenges (`HoneypotEngine`)
When a bot exceeds limits, WNP returns an HTTP 429 status code containing a SHA-256 computational challenge. Honest scrapers can solve the puzzle to earn extra request tokens without human intervention.

### 3. Honeypot Traps (`HoneypotEngine`)
Injects hidden links into HTML responses. Bots following invisible honeypots are automatically flagged and blocked.

### 4. Semantic Noise Injection (`SemanticNoiseGenerator`)
Injects zero-width whitespace or subtle text noise into scraped responses to disincentivize unauthorized extraction while keeping content 100% human-readable.
