pub struct MeshNode {
    pub node_id: String,
}

impl MeshNode {
    pub fn new(id: &str) -> Self {
        MeshNode { node_id: id.to_string() }
    }
}
