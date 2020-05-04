use serde::Serialize;

#[derive(Serialize)]
pub struct OkResponse {
    pub ok: bool,
}

#[derive(Serialize)]
pub struct ErrorResponse {
    pub ok: bool,
    pub message: String,
}

impl ErrorResponse {
    pub fn new(message: String) -> Self {
        ErrorResponse { ok: false, message }
    }
}

impl OkResponse {
    pub fn new() -> Self {
        OkResponse { ok: true }
    }
}

impl JsonSer for OkResponse {}
impl JsonSer for ErrorResponse {}

pub trait JsonSer: serde::Serialize {
    fn to_json(&self) -> String {
        serde_json::to_string(self).expect("Failed to serialize response structure")
    }
}
