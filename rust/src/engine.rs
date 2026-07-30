use std::collections::HashMap;
use crate::config::WNPConfig;
use crate::policy::{PolicyEvaluator, PolicyActionResult};
use crate::classifier::{RequestClassifier, ClassificationResult};

pub struct WNPEngine {
    pub config: WNPConfig,
    policy_evaluator: PolicyEvaluator,
    classifier: RequestClassifier,
}

impl WNPEngine {
    pub fn new(config: WNPConfig) -> Self {
        let policy_evaluator = PolicyEvaluator::new(config.policies.clone());
        let classifier = RequestClassifier::new(config.adapters.detection.clone());
        WNPEngine {
            config,
            policy_evaluator,
            classifier,
        }
    }

    pub fn classify(&self, path: &str, headers: &HashMap<String, String>) -> WNPExecutionResult {
        // Check scope
        if !self.is_in_scope(path) {
            return WNPExecutionResult {
                in_scope: false,
                consumer_type: "human".to_string(),
                action: "allow_full".to_string(),
                metadata: HashMap::new(),
            };
        }

        let classification = self.classifier.classify(headers);
        let action_result = self.policy_evaluator.evaluate(&classification.consumer_type);

        WNPExecutionResult {
            in_scope: true,
            consumer_type: classification.consumer_type,
            action: action_result.action,
            metadata: action_result.metadata,
        }
    }

    fn is_in_scope(&self, path: &str) -> bool {
        for exc in &self.config.scope.exclude {
            if path.starts_with(exc) {
                return false;
            }
        }
        for inc in &self.config.scope.paths {
            if inc == "/**" || path.starts_with(&inc.replace("/**", "")) {
                return true;
            }
        }
        false
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct WNPExecutionResult {
    pub in_scope: bool,
    pub consumer_type: String,
    pub action: String,
    pub metadata: HashMap<String, String>,
}
