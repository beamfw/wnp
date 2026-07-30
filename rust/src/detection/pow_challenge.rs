pub struct PowChallenge;

impl PowChallenge {
    pub fn verify(challenge: &str, solution: &str, difficulty: usize) -> bool {
        use sha2::{Sha256, Digest};
        let mut hasher = Sha256::new();
        hasher.update(format!("{}{}", challenge, solution));
        let result = hasher.finalize();
        let zeros = result.iter().take_while(|&&b| b == 0).count();
        zeros >= difficulty
    }
}
