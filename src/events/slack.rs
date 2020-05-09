use serde::Deserialize;
use simple_error::{SimpleResult};

#[derive(Deserialize, Debug)]
#[serde(tag = "type")]
pub enum SlackEvent {
    #[serde(rename = "event_callback")]
    Envelope { event: InnerEvent, team_id: String },

    #[serde(rename = "url_verification")]
    Challenge { challenge: String },
}

#[derive(Deserialize, Debug)]
#[serde(tag = "type")]
pub enum InnerEvent {
    #[serde(rename = "message")]
    Message { user: String, text: String },

    #[serde(rename = "reaction_added")]
    Reaction {
        user: String,
        reaction: String,
        item_user: String,
    },
}

// impl InnerEvent {
//     pub fn from_json(json: &serde_json::Value) -> Result<InnerEvent, String> {
//         json.as_object()
//             .map(|j| j.)
//     }
// }

// #[derive(Deserialize)]
// pub struct EnvelopeEvent {
//     #[serde(rename = "type")]
//     pub kind: OuterEventKind::Envelope,
//     pub event: Event,
// }

// #[derive(Deserialize)]
// pub struct EventWithKind {
//     #[serde(rename = "type")]
//     pub kind: OuterEventKind,
// }

// impl SlackEvent {
//     pub fn from_json(json: &str) -> Result<SlackEvent, String> {
//         serde_json::from_str::<serde_json::Value>(json)
//             .map_err (|_| "Could not deserialize Slack Event".to_owned())
//             .and_then(RawEvent::from_json)
//             .and_then(Self::from_raw)
//     }
//
//     fn from_raw(event: RawEvent) -> Result<SlackEvent, String> {
//         use SlackEventType::*;
//         use SlackEvent::*;
//
//         match event.kind {
//             Challenge => parse_challenge(event),
//             Envelope  => parse_envelope(event),
//             _         => Ok(Other(event.json)),
//         }
//     }
//
//     fn parse_challenge(event: RawEvent) -> Result<SlackEvent, String> {
//         event.json["challenge"]
//             .as_str()
//             .map   (|challenge| SlackEvent::Challenge(challenge.to_owned()))
//             .ok_or ("Challenge event didn't have challenge".to_owned())
//     }
//
//     fn parse_envelope(envl: &RawEvent) -> Result<SlackEvent, String> {
//         envl.json.get("event")
//             .ok_or   ("Envelope had no inner event".to_owned())
//             .and_then(InnerEvent::from_json)
//             .and_then(|event| {
//                 envl.json["team_id"]
//                     .as_str()
//                     .map   (str::to_string)
//                     .map   (|team_id| SlackEvent::Envelope { event, team_id })
//                     .ok_or ("Envelope had invalid inner event".to_owned())
//             })
//     }
// }
//
// struct RawEvent {
//     kind: SlackEventType,
//     json: serde_json::Value
// }
//
// impl RawEvent {
//     pub fn from_json(json: serde_json::Value) -> Result<RawEvent, String> {
//         json.get("type")
//             .ok_or("Could not get type from Slack Event".to_owned())
//             .and_then(|t| SlackEventType::from_str(type_raw))
//             .map_err(|_| "Could not parse type of Slack Event".to_owned())
//             .map(|kind| RawEvent { json, kind })
//     }
// }

pub fn act_on_event(event: SlackEvent) -> SimpleResult<String> {
    match event {
        SlackEvent::Challenge { challenge } => Ok(challenge),
        SlackEvent::Envelope {
            team_id: _,
            event: e,
        } => match e {
            InnerEvent::Message { user: _, text: _ } => handle_message(),
            InnerEvent::Reaction {
                user: _,
                reaction: _,
                item_user: _,
            } => handle_reaction(),
        },
    }
}

fn handle_message() -> SimpleResult<String> {
    unimplemented!()
}

fn handle_reaction() -> SimpleResult<String> {
    unimplemented!()
}
