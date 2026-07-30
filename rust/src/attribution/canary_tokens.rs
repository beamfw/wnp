pub struct CanaryTokens;

impl CanaryTokens {
    pub fn inject_html_comment(html: &str, token_id: &str) -> String {
        format!("<!-- wnp-canary:{} -->\n{}", token_id, html)
    }
}
