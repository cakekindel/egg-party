use crate::http_ez::err::ReqErr;
use http::Request;
use std::convert::{TryFrom};
use crate::http_ez::StringInputErr;

type LambdaRequest = Request<lambda_http::Body>;

pub struct Req(http::Request<String>);

impl Req {
    pub fn try_from_lambda(request: LambdaRequest) -> Result<Self, ReqErr> {
        Self::try_from(request)
    }

    pub fn get_json_body(&self) -> Result<&str, ReqErr> {
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
                    Ok(self.0.body().as_str())
                } else {
                    Err(ReqErr::Header(ContentType(ValueInvalid {
                        expected: "application/json".to_string(),
                        actual: content_type_val.to_string(),
                    })))
                }
            })
    }

    pub fn parse_json_body<'a, T : serde::Deserialize<'a>>(&'a self) -> Result<T, ReqErr> {
        let json_parse_err = ReqErr::Body(StringInputErr::ParseErr);

        self.get_json_body()
            .map(serde_json::from_str::<T>)
            .and_then(|r| r.map_err(|_| json_parse_err))
    }
}

impl From<http::Request<String>> for Req {
    fn from(request: Request<String>) -> Self {
        Req(request)
    }
}

impl TryFrom<LambdaRequest> for Req {
    type Error = ReqErr;

    fn try_from(request: LambdaRequest) -> Result<Self, Self::Error> {
        use crate::http_ez::err::StringInputErr::*;
        use lambda_http::Body;

        Ok(request)
            .and_then(|req| match req.body() {
                Body::Text(json) => Ok(json.to_string()),
                Body::Binary(_) => Err(ReqErr::Body(ParseErr)),
                Body::Empty => Err(ReqErr::Body(Missing)),
            }.map(|json| req.map(|_| json.to_owned()).into()))
    }
}
