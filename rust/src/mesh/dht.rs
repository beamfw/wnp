pub struct DhtRegistry;

impl DhtRegistry {
    pub fn lookup(key: &str) -> Option<String> {
        if key == "threat_registry" {
            Some("dht_ok".to_string())
        } else {
            None
        }
    }
}
