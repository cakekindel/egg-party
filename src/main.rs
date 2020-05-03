use serde_json::json;
use lambda_runtime::{error::HandlerError};
use lambda_http::{lambda, IntoResponse, Request, RequestExt, Body, http};
use log;

mod db;
mod events;

use events::slack::{InnerEvent, SlackEvent};
use simple_error::{SimpleError, SimpleResult};
use crate::events::slack::{act_on_event};

type Error = Box<dyn std::error::Error>;

fn main() -> Result<(), Error> {
    simple_logger::init_with_level(log::Level::Debug)?;
    lambda!(handle_invocation);
    Ok(())
}

fn handle_invocation(request: Request, _ctx: lambda_runtime::Context) -> Result<impl IntoResponse, HandlerError> {
    let respond_bad_request = |e: SimpleError| http::Response::builder().status(400).body(e.to_string()).unwrap();
    let respond_not_found = || http::Response::builder().status(404).body("".to_owned()).unwrap();
    let respond_ok = |body: String| http::Response::builder().status(200).body(body).unwrap();

    match get_json_from_body(&request) {
        Err(e) => Ok(respond_bad_request(e)),
        Ok(json) =>
            if request.uri().path().starts_with("/slack-events") {
                act_on_event(&json)
                    .map(respond_ok)
                    .map_err(|e| HandlerError::from(e.as_str()))
            } else {
                Ok(respond_not_found())
            }
    }
}

fn get_json_from_body(request: &Request) -> SimpleResult<String> {
    use http::header::ToStrError;
    let err_no_content_type = || SimpleError::new("Content-Type header not set.");
    let err_bad_content_type = |_: ToStrError| SimpleError::new("Content-Type header not valid ASCII text");
    let err_wrong_content_type = |content_type: &str| SimpleError::new(format!("Content-Type header set to {}, use application/json.", content_type));
    let err_wrong_body_type = |body: &Body| SimpleError::new(format!("Expected body type Json, got {:?}", body));

    request.headers()
        .get(http::header::CONTENT_TYPE)
        .ok_or(err_no_content_type())
        .and_then(|header_val| header_val.to_str().map_err(err_bad_content_type))
        .and_then(|content_type|
            if content_type.contains("application/json") { Ok(()) }
            else { Err(err_wrong_content_type(content_type)) })
        .and_then(|_| match request.body() {
            Body::Text(json) => Ok(json.clone()),
            body => Err(err_wrong_body_type(body))
        })
}
