pub enum EggEventType {
    Given,
    Received,
    BankRefreshed,
}

pub struct EggEvent {
    pub id: u64,
    pub created_at: String,
    pub kind: EggEventType,
}
