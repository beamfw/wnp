pub struct TlsFingerprinter;

impl TlsFingerprinter {
    pub fn analyze_ja4(ja4: &str) -> bool {
        !ja4.is_empty()
    }
}
