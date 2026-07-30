use sha2::{Sha256, Digest};

pub struct HashUtils;

impl HashUtils {
    pub fn sha256(input: &str) -> String {
        let mut hasher = Sha256::new();
        hasher.update(input.as_bytes());
        format!("{:x}", hasher.finalize())
    }
}
