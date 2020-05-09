pub struct JsonString(String);

impl From<String> for JsonString {
    fn from(s: String) -> Self {
        JsonString(s)
    }
}

impl JsonString {
    pub fn deserialize<'a, T: serde::Deserialize<'a>>(&'a self)
        -> Result<T, serde_json::Error> {
        serde_json::from_str::<'a, T>(self.0.as_str())
    }
}
