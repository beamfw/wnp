pub struct GossipProtocol;

impl GossipProtocol {
    pub fn broadcast_threat(ip_or_ua: &str) -> String {
        format!("GOSSIP_THREAT:{}", ip_or_ua)
    }
}
