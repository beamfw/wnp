pub struct AttestationLedger {
    entries: Vec<String>,
}

impl AttestationLedger {
    pub fn new() -> Self {
        AttestationLedger { entries: Vec::new() }
    }

    pub fn append(&mut self, entry: String) {
        self.entries.push(entry);
    }

    pub fn get_entries(&self) -> &[String] {
        &self.entries
    }
}
