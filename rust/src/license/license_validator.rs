pub struct LicenseValidator;

impl LicenseValidator {
    pub fn validate_license_json(json_str: &str) -> bool {
        json_str.contains("terms") && json_str.contains("require_attribution")
    }
}
