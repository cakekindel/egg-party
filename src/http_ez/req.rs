use crate::http_ez::err::ReqErr;
use crate::http_ez::json::JsonString;
use http::Request;
use lambda_http::Body;
use simple_error::SimpleError;
use std::convert::{TryFrom, TryInto};

pub struct Req(http::Request<String>);

impl TryInto<JsonString> for Req {
    type Error = ReqErr;

    fn try_into(self) -> Result<JsonString, Self::Error> {
        use crate::http_ez::err::{HeaderErr::*, StringInputErr::*};

        self.0
            .headers()
            .get(http::header::CONTENT_TYPE)
            .ok_or(ReqErr::Header(ContentType(Missing)))
            .and_then(|header_val| {
                header_val
                    .to_str()
                    .map_err(|_| ReqErr::Header(ContentType(ParseErr)))
            })
            .and_then(|content_type_val| {
                if content_type_val.contains("application/json") {
                    Ok(self.0.body().to_owned().into())
                } else {
                    Err(ReqErr::Header(ContentType(ValueInvalid {
                        expected: "application/json".to_string(),
                        actual: content_type_val.to_string(),
                    })))
                }
            })
    }
}

impl From<http::Request<String>> for Req {
    fn from(request: Request<String>) -> Self {
        Req(request)
    }
}

impl TryFrom<http::Request<lambda_http::Body>> for Req {
    type Error = ReqErr;

    fn try_from(request: Request<Body>) -> Result<Self, Self::Error> {
        use crate::http_ez::err::StringInputErr::*;

        Ok(request)
            .and_then(|req| match req.body() {
                Body::Text(json) => Ok(json.to_string()),
                Body::Binary(_) => Err(ReqErr::Body(ParseErr)),
                Body::Empty => Err(ReqErr::Body(Missing)),
            }.map(|json| req.map(|_| json.to_owned()).into()))
    }
}
