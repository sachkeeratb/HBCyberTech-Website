use std::time::SystemTime;
use chrono::Utc;
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Serialize, Deserialize};
use lazy_static::lazy_static;
use regex::Regex;

lazy_static! {
  static ref RE_FULL_NAME: Regex = Regex::new(r"^[A-Za-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ ']{2,40}$").unwrap();
  static ref RE_EMAIL: Regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@pdsb.net$").unwrap();
  static ref RE_EXTRA: Regex = Regex::new(r"^.{0,350}$").unwrap();
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GeneralMember {
  pub _id: ObjectId,
  pub full_name: String,
  pub email: String,
  pub skills: u8,
  pub extra: String,
  pub date_created: DateTime
}

#[derive(Serialize, Deserialize, Validate)]
pub struct GeneralMemberRequest {
  #[validate(regex(
    path = *RE_FULL_NAME,
    message = "Invalid name."
  ))]
  pub full_name: String,
  #[validate(
    regex(
      path = *RE_EMAIL,
      message = "Email must be a valid PDSB email."
    )
  )]
  pub email: String,
  #[validate(range(min = 0, max = 100, message = "Skills should be from 0 to 100."))]
  pub skills: u8,
  #[validate(
    regex(
      path = *RE_EXTRA,
      message = "Extra information should be from 0 to 350."
    )
  )]
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