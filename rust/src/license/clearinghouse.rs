pub struct Clearinghouse;

impl Clearinghouse {
    pub fn sign_agreement(org: &str, contact: &str) -> String {
        format!("{{\"signed\":true,\"org\":\"{}\",\"contact\":\"{}\",\"timestamp\":1690000000}}", org, contact)
    }
}
