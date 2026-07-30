pub struct ImageWatermark;

impl ImageWatermark {
    pub fn c2pa_manifest_header(claim_generator: &str) -> String {
        format!("x-c2pa-manifest-generator: {}", claim_generator)
    }
}
