use serde::export::Formatter;
use std::fmt;

pub enum ReqErr {
    Header(HeaderErr),
    Body(StringInputErr),
}

pub enum HeaderErr {
    ContentType(StringInputErr),
}

pub enum StringInputErr {
    Missing,
    ParseErr,
    ValueInvalid {
        actual: String,
        expected: String,
    },
    ValueUnsupported {
        actual: String,
        allowed: Vec<String>,
    },
}

impl fmt::Display for StringInputErr {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        use StringInputErr::*;

        let message = match self {
            ValueInvalid { expected, actual } => {
                format!("was {}, but expected {}", actual, expected)
            }
            ValueUnsupported { allowed, actual } => format!(
                "was {}, which is not one of allowed values: {:?}",
                actual, allowed
            ),
            Missing => "missing".to_string(),
            ParseErr => "was invalid string".to_string(),
        };

        writeln!(f, "{}", message)
    }
}

impl fmt::Display for HeaderErr {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        use http::header::*;
        use HeaderErr::*;

        let (header_name, message) = match self {
            ContentType(err) => (CONTENT_TYPE.to_string(), err.to_string()),
        };

        writeln!(f, "Header '{}' {}", header_name, message)
    }
}

impl fmt::Display for ReqErr {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        let message = match self {
            ReqErr::Header(err) => err.to_string(),
            ReqErr::Body(err) => format!("Body {}", err.to_string()),
        };

        writeln!(f, "Problem with Request! {}", message)
    }
}
