pub struct JwtIssuer;

impl JwtIssuer {
    pub fn issue_token(subject: &str, secret: &str) -> String {
        format!("wnp_jwt.{}.{}", subject, secret.len())
    }
}
