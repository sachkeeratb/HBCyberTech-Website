use std::time::SystemTime;
use chrono::Utc;
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneralMember {
  pub _id: ObjectId,
  pub full_name: String,
  pub email: String,
  pub skills: u8,
  pub extra: String,
  pub date_created: DateTime
}

#[derive(Serialize, Deserialize)]
pub struct GeneralMemberRequest {
  pub full_name: String,
  pub email: String,
  pub skills: u8,
  pub extra: String,
  pub date_created: String
}

impl TryFrom<GeneralMemberRequest> for GeneralMember {
  type Error = Box<dyn std::error::Error>;

  fn try_from(item: GeneralMemberRequest) -> Result<Self, Self::Error> {
    let chrono_datetime: SystemTime = chrono::DateTime::parse_from_rfc3339(&item.date_created)
      .map_err(|err| format!("Error parsing date: {err}"))?
      .with_timezone(&Utc)
      .into();

    Ok(Self {
      _id: ObjectId::new(),
      full_name: item.full_name,
      email: item.email,
      skills: item.skills,
      extra: item.extra,
      date_created: DateTime::from(chrono_datetime)
    })
  }
}