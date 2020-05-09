use lambda_http::{lambda, IntoResponse, Request};
use lambda_runtime::error::HandlerError;
use std::convert::{TryFrom};
use http::Response;

mod db;
mod events;
mod http_ez;

use crate::events::slack::{SlackEvent};
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
        .and_then(|req| req.parse_json_body::<SlackEvent>())
        .map_err(Res::bad_request)
        .map(events::slack::act_on_event)
        .and_then(|result| result.map_err(Res::err))
        .map(Res::ok)
        .unwrap_or_else(|bad_response| bad_response)
        .and_log_response()
        .into()
}


