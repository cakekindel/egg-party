use events::slack::{InnerEvent, SlackEvent};
use lambda_http::{http, lambda, Body, IntoResponse, Request, RequestExt};
use lambda_runtime::error::HandlerError;
use log::{error, info, warn};
use serde_json::json;
use simple_error::{SimpleError, SimpleResult};
use std::convert::{TryFrom, TryInto};

mod db;
mod events;
mod http_ez;

use crate::events::slack::act_on_event;
use crate::http_ez::err::ReqErr;
use crate::http_ez::json::JsonString;
use crate::http_ez::req::Req;
use crate::http_ez::res::{Res, ResKind};

type Error = Box<dyn std::error::Error>;

fn main() -> Result<(), Error> {
    simple_logger::init_with_level(log::Level::Debug)?;
    lambda!(handle_invocation);
    Ok(())
}

fn handle_invocation(
    request: Request,
    _ctx: lambda_runtime::Context,
) -> Result<impl IntoResponse, HandlerError> {
    // This Result is special, we use:
    //  - the Err lane to construct error responses,
    //  - the Ok lane to deserialize & act on the slack event
    let response = Ok(request)
        .and_then(Req::try_from)
        .map_err(Res::bad_request)
        .and_then(|req| req.try_into().map_err(Res::bad_request))
        .and_then(|j: JsonString| j.deserialize::<SlackEvent>().map_err(Res::bad_request))
        .and_then(|event| act_on_event(event).map_err(Res::err))
        .map(Res::ok)
        .unwrap_or_else(|e| e); // Since the result is either Res or Res, unwrap

    log_response(&response);

    Ok(response)
}

fn log_response(res: &Res) {
    match res.get_kind() {
        ResKind::ServerError => error!("{}", res.0.body()),
        ResKind::ClientError => warn!("{}", res.0.body()),
        _ => info!("{}", res.0.body()), // Log client errors just in case
    };
}
