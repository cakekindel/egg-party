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
