pub struct TokenEmbedder;

impl TokenEmbedder {
    pub fn embed_zero_width_watermark(text: &str, payload_id: &str) -> String {
        let binary: String = payload_id
            .bytes()
            .map(|b| format!("{:08b}", b))
            .collect();
        let watermark: String = binary
            .chars()
            .map(|c| if c == '0' { '\u{200B}' } else { '\u{200C}' })
            .collect();
        format!("{}{}", watermark, text)
    }
}
