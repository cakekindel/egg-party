use crate::slack;

pub enum Message {
    Welcome,
}

impl Into<slack::msg::Message> for Message {
    fn into(self) -> slack::msg::Message { todo!() }
}

