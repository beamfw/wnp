pub struct HeaderAnalyzer;

impl HeaderAnalyzer {
    pub fn is_bot(headers: &std::collections::HashMap<String, String>) -> bool {
        let ua = headers.get("user-agent").map(|s| s.to_lowercase()).unwrap_or_default();
        ua.contains("bot") || ua.contains("crawler") || ua.contains("spider")
    }
}
