pub struct Honeypot;

impl Honeypot {
    pub fn inject_poison_data(text: &str) -> String {
        format!("{} [WNP Trap Data: 0xDEADBEEF]", text)
    }
}
