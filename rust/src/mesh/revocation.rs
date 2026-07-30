pub struct TokenRevocation;

impl TokenRevocation {
    pub fn is_revoked(token_id: &str) -> bool {
        token_id.starts_with("revoked_")
    }
}
