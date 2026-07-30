pub struct TokenVerifier;

impl TokenVerifier {
    pub fn extract_zero_width_watermark(text: &str) -> Option<String> {
        let mut bits = String::new();
        for ch in text.chars() {
            if ch == '\u{200B}' {
                bits.push('0');
            } else if ch == '\u{200C}' {
                bits.push('1');
            }
        }
        if bits.is_empty() || bits.len() % 8 != 0 {
            return None;
        }
        let bytes: Vec<u8> = (0..bits.len())
            .step_by(8)
            .filter_map(|i| u8::from_str_radix(&bits[i..i + 8], 2).ok())
            .collect();
        String::from_utf8(bytes).ok()
    }
}
