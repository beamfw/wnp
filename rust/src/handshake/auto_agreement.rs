pub struct AutoAgreement;

impl AutoAgreement {
    pub fn negotiate(provider: &str) -> Option<&'static str> {
        match provider {
            "openai" | "anthropic" | "perplexity" => Some("full_with_attribution"),
            _ => Some("summary_only"),
        }
    }
}
