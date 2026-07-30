use std::collections::HashMap;
use crate::config::PolicyRule;

pub struct PolicyEvaluator {
    policies: HashMap<String, PolicyRule>,
}

pub struct PolicyActionResult {
    pub action: String,
    pub metadata: HashMap<String, String>,
}

impl PolicyEvaluator {
    pub fn new(policies: HashMap<String, PolicyRule>) -> Self {
        PolicyEvaluator { policies }
    }

    pub fn evaluate(&self, consumer_type: &str) -> PolicyActionResult {
        if let Some(rule) = self.policies.get(consumer_type) {
            let mut meta = HashMap::new();
            if let Some(words) = rule.max_words {
                meta.insert("max_words".to_string(), words.to_string());
            }
            PolicyActionResult {
                action: rule.action.clone(),
                metadata: meta,
            }
        } else if let Some(rule) = self.policies.get("unknown_bot") {
            PolicyActionResult {
                action: rule.action.clone(),
                metadata: HashMap::new(),
            }
        } else {
            PolicyActionResult {
                action: "allow_full".to_string(),
                metadata: HashMap::new(),
            }
        }
    }
}
