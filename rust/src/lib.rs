pub mod engine;
pub mod config;
pub mod policy;
pub mod classifier;
pub mod detection;
pub mod attribution;
pub mod license;
pub mod handshake;
pub mod watermark;
pub mod mesh;
pub mod utils;

pub use engine::WNPEngine;
pub use config::WNPConfig;
pub use policy::PolicyEvaluator;
pub use classifier::RequestClassifier;

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WNPWasmEngine {
    engine: WNPEngine,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WNPWasmEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(config_json: &str) -> Result<WNPWasmEngine, JsValue> {
        let config: WNPConfig = serde_json::from_str(config_json)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        Ok(WNPWasmEngine {
            engine: WNPEngine::new(config),
        })
    }

    #[wasm_bindgen]
    pub fn classify_request(&self, path: &str, headers_json: &str) -> Result<String, JsValue> {
        let headers: std::collections::HashMap<String, String> = serde_json::from_str(headers_json)
            .map_err(|e| JsValue::from_str(&e.to_string()))?;
        let res = self.engine.classify(path, &headers);
        serde_json::to_string(&res).map_err(|e| JsValue::from_str(&e.to_string()))
    }
}
