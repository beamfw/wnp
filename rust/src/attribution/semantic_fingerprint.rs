use sha2::{Sha256, Digest};

pub struct SemanticFingerprinter;

impl SemanticFingerprinter {
    pub fn compute_hash(text: &str) -> String {
        let normalized = text.split_whitespace().collect::<Vec<&str>>().join(" ");
        let mut hasher = Sha256::new();
        hasher.update(normalized.as_bytes());
        format!("{:x}", hasher.finalize())
    }
}
