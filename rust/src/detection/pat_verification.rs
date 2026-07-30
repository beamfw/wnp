pub struct PatVerifier;

impl PatVerifier {
    pub fn verify_pat_token(token: &str) -> bool {
        !token.is_empty()
    }
}
