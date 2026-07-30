pub struct PatternAnalyzer;

impl PatternAnalyzer {
    pub fn is_burst(req_count: u32, window_secs: u32) -> bool {
        if window_secs == 0 { return false; }
        req_count / window_secs > 10
    }
}
