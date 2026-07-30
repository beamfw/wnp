pub struct LicenseGenerator;

impl LicenseGenerator {
    pub fn generate_default_license(site_url: &str) -> String {
        format!(
            "{{\"version\":\"2.0\",\"site\":\"{}\",\"terms\":{{\"require_attribution\":true,\"require_canonical_link\":true}}}}",
            site_url
        )
    }
}
