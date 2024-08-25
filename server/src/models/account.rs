use std::time::SystemTime;
use chrono::Utc;
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Serialize, Deserialize};
use lazy_static::lazy_static;
use regex::Regex;

lazy_static! {
  static ref RE_USERNAME: Regex = Regex::new(r"^^[a-zA-Z0-9._%+-]{2,20}$").unwrap();
  static ref RE_EMAIL: Regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@pdsb.net$").unwrap();
  static ref RE_PASSWORD: Regex = Regex::new(r"^.{0,50}$").unwrap();
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Account {
  pub _id: ObjectId,
  pub username: String,
  pub email: String,
  pub password: String,
  pub verified: bool,
  pub date_created: DateTime
}

#[derive(Serialize, Deserialize, Validate)]
pub struct AccountRequest {
  #[validate(regex(
    path = *RE_USERNAME,
    message = "Invalid username."
  ))]
  pub username: String,
  #[validate(
    regex(
      path = *RE_EMAIL,
      message = "Email must be a valid PDSB email."
    )
  )]
  pub email: String,
  #[validate(
    regex(
      path = *RE_PASSWORD,
      message = "Keep your password at a reasonable length."
    )
  )]
  pub password: String,
  pub verified: bool,
  pub date_created: String
}

impl TryFrom<AccountRequest> for Account {
  type Error = Box<dyn std::error::Error>;

  fn try_from(item: AccountRequest) -> Result<Self, Self::Error> {
    let chrono_datetime: SystemTime = chrono::DateTime::parse_from_rfc3339(&item.date_created)
      .map_err(|err| format!("Error parsing date: {err}"))?
      .with_timezone(&Utc)
      .into();

    Ok(Self {
      _id: ObjectId::new(),
      username: item.username,
      email: item.email,
      password: item.password,
      verified: item.verified,
      date_created: DateTime::from(chrono_datetime)
    })
  }
}