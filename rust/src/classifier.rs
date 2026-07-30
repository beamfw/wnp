use std::collections::HashMap;
use crate::config::AdapterItem;

pub struct RequestClassifier {
    _adapters: Vec<AdapterItem>,
}

pub struct ClassificationResult {
    pub consumer_type: String,
    pub confidence: f32,
}

impl RequestClassifier {
    pub fn new(adapters: Vec<AdapterItem>) -> Self {
        RequestClassifier { _adapters: adapters }
    }

    pub fn classify(&self, headers: &HashMap<String, String>) -> ClassificationResult {
        let ua = headers.get("user-agent").map(|s| s.to_lowercase()).unwrap_or_default();

        if ua.contains("gptbot") || ua.contains("claude-web") || ua.contains("bytespider") || ua.contains("ccbot") {
            ClassificationResult {
                consumer_type: "ai_scraper".to_string(),
                confidence: 0.95,
            }
        } else if ua.contains("perplexitybot") {
            ClassificationResult {
                consumer_type: "live_search".to_string(),
                confidence: 0.95,
            }
        } else if ua.contains("googlebot") || ua.contains("bingbot") || ua.contains("duckduckbot") {
            ClassificationResult {
                consumer_type: "search_bot".to_string(),
                confidence: 0.95,
            }
        } else if ua.contains("mozilla") || ua.contains("chrome") || ua.contains("safari") {
            // Check for missing typical browser headers
            let missing_browser_headers = !headers.contains_key("accept-language") || !headers.contains_key("accept");
            if missing_browser_headers {
                ClassificationResult {
                    consumer_type: "ai_scraper".to_string(),
                    confidence: 0.65,
                }
            } else {
                ClassificationResult {
                    consumer_type: "human".to_string(),
                    confidence: 0.90,
                }
            }
        } else {
            ClassificationResult {
                consumer_type: "unknown_bot".to_string(),
                confidence: 0.50,
            }
        }
    }
}
