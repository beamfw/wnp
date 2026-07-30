pub struct GracefulDegrade;

impl GracefulDegrade {
    pub fn generate_fallback_html(title: &str, target_url: &str) -> String {
        format!(
            "<!DOCTYPE html><html><head><title>{}</title></head><body><h1>{}</h1><p><a href=\"{}\">Click to view full content</a></p></body></html>",
            title, title, target_url
        )
    }
}
