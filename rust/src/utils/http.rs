pub struct HttpUtils;

impl HttpUtils {
    pub fn parse_header_val(header_raw: &str) -> Option<&str> {
        if header_raw.is_empty() { None } else { Some(header_raw.trim()) }
    }
}
