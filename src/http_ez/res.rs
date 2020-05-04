use crate::http_ez::res_body::{ErrorResponse, JsonSer, OkResponse};
use http::status::StatusCode;
use lambda_http::{Body, IntoResponse, Response};
use serde::export::Formatter;
use simple_error::SimpleError;
use std::fmt;

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
        Res(response)
    }
}

impl IntoResponse for Res {
    fn into_response(self) -> Response<Body> {
        self.0.map(|str| Body::Text(str))
    }
}

impl Res {
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
            .body(body.to_string())
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
