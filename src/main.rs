use http::Response;
use lambda_http::{lambda, Request};

mod db;
mod http_ez;
mod msg;
mod slack;

use crate::http_ez::{Req, Res};

type Error = Box<dyn std::error::Error>;

fn main() -> Result<(), Error> {
    simple_logger::init_with_level(log::Level::Info)?;

    lambda!(|r, _| Ok(request_handler(r)));

    Ok(())
}

fn request_handler(request: Request) -> Response<String> {
    // This Result is special, we use:
    //  - the Err lane to construct error responses,
    //  - the Ok lane to deserialize & act on the slack event
    Ok(request)
        .and_then(Req::try_from_lambda)
        .and_then(|r| r.parse_json_body::<slack::event::Event>())
        .map_err(Res::bad_request)
        .and_then(|e| slack::event::act_on_event(e).map_err(Res::err))
        .map(Res::ok)
        .unwrap_or_else(|bad_response| bad_response)
        .and_log_response()
        .into()
}
