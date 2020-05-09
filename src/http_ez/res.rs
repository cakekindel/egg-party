use crate::http_ez::{ErrorResponse, JsonSer};
use http::status::StatusCode;
use serde::export::Formatter;
use std::fmt;
use http::Response;
use log::{error, info, warn};

pub struct Res(pub http::Response<String>);

pub enum ResKind {
    Ok,
    ClientError,
    ServerError,
    Other,
}

impl fmt::Display for Res {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        writeln!(f, "{}", self.0.body())
    }
}

impl From<http::Response<String>> for Res {
    fn from(response: http::Response<String>) -> Self {
        Self(response)
    }
}

impl Into<http::Response<String>> for Res {
    fn into(self) -> Response<String> {
        self.0
    }
}

impl lambda_http::IntoResponse for Res {
    fn into_response(self) -> lambda_http::Response<lambda_http::Body> {
        self.0.map(lambda_http::Body::Text)
    }
}

impl Res {
    pub fn and_log_response(self) -> Self {
        match self.get_kind() {
            ResKind::ServerError => error!("{}", self),
            ResKind::ClientError => warn!("{}", self), // Log client errors just in case
            ResKind::Other => info!("{}", self),
            _ => (),
        }

        self
    }

    pub fn get_kind(&self) -> ResKind {
        match self.0.status() {
            StatusCode::OK => ResKind::Ok,
            StatusCode::BAD_REQUEST => ResKind::ClientError,
            StatusCode::INTERNAL_SERVER_ERROR => ResKind::ServerError,
            _ => ResKind::Other,
        }
    }

    pub fn ok(body: String) -> Res {
        http::Response::builder()
            .status(StatusCode::OK)
            .body(body)
            .unwrap()
            .into()
    }

    pub fn bad_request<E: ToString>(err: E) -> Res {
        http::Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(ErrorResponse::new(err.to_string()).to_json())
            .unwrap()
            .into()
    }

    pub fn err<E: ToString>(err: E) -> Res {
        http::Response::builder()
            .status(StatusCode::BAD_REQUEST)
            .body(ErrorResponse::new(err.to_string()).to_json())
            .unwrap()
            .into()
    }
}
