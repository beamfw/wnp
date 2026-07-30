pub struct TextWatermark;

impl TextWatermark {
    pub fn apply(content: &str, tag: &str) -> String {
        format!("<!-- wnp-wm:{} -->{}", tag, content)
    }
}
