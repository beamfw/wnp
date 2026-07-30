use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WNPConfig {
    pub version: String,
    pub scope: ScopeConfig,
    pub policies: HashMap<String, PolicyRule>,
    pub adapters: AdaptersConfig,
    #[serde(default)]
    pub telemetry: TelemetryConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScopeConfig {
    pub paths: Vec<String>,
    #[serde(default)]
    pub exclude: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PolicyRule {
    pub action: String,
    #[serde(default)]
    pub description: Option<String>,
    #[serde(default)]
    pub max_words: Option<usize>,
    #[serde(default)]
    pub require_attribution: Option<serde_json::Value>,
    #[serde(default)]
    pub layers: Option<Vec<serde_json::Value>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdaptersConfig {
    #[serde(default)]
    pub detection: Vec<AdapterItem>,
    #[serde(default)]
    pub attribution: Vec<AdapterItem>,
    #[serde(default)]
    pub watermark: Vec<AdapterItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AdapterItem {
    pub name: String,
    #[serde(default = "default_true")]
    pub enabled: bool,
    #[serde(default = "default_priority")]
    pub priority: usize,
}

fn default_true() -> bool { true }
fn default_priority() -> usize { 1 }

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct TelemetryConfig {
    #[serde(default)]
    pub enabled: bool,
    #[serde(default)]
    pub self_hosted: bool,
}
