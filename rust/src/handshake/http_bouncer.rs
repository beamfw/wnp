pub struct HttpBouncer;

impl HttpBouncer {
    pub fn get_response_status(action: &str) -> u16 {
        match action {
            "block" => 403,
            "negotiated" => 402,
            _ => 200,
        }
    }
}
