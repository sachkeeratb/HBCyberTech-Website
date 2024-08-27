use std::time::SystemTime;
use chrono::Utc;
use mongodb::bson::{oid::ObjectId, Array, DateTime};
use serde::{Serialize, Deserialize};
use lazy_static::lazy_static;
use regex::Regex;

lazy_static! {
  static ref RE_USERNAME: Regex = Regex::new(r"^^[a-zA-Z0-9._%+-]{2,20}$").unwrap();
  static ref RE_EMAIL: Regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@pdsb.net$").unwrap();
  static ref RE_TITLE: Regex = Regex::new(r"^.{5,20}$").unwrap();
  static ref RE_BODY: Regex = Regex::new(r"^.{20,600}$").unwrap();
}

#[derive(Serialize, Deserialize)]
pub struct Post {
  pub _id: ObjectId,
  pub author: String,
  pub email: String,
	pub date_created: DateTime,
	pub title: String,
	pub body: String,
  pub comments: Array
}

#[derive(Serialize, Deserialize, Validate)]
pub struct PostRequest {
  pub id: String,
  #[validate(regex(
    path = *RE_USERNAME,
    message = "Invalid username."
  ))]
  pub author: String,
  #[validate(
    regex(
      path = *RE_EMAIL,
      message = "Email must be a valid PDSB email."
    )
  )]
  pub email: String,
	pub date_created: String,
  #[validate(regex(
    path = *RE_TITLE,
    message = "Invalid title length."
  ))]
	pub title: String,
  #[validate(regex(
    path = *RE_BODY,
    message = "Invalid body length."
  ))]
	pub body: String,
  pub comments: Array
}

impl TryFrom<PostRequest> for Post {
  type Error = Box<dyn std::error::Error>;

  fn try_from(item: PostRequest) -> Result<Self, Self::Error> {
    let chrono_datetime: SystemTime = chrono::DateTime::parse_from_rfc3339(&item.date_created)
      .map_err(|err| format!("Error parsing date: {err}"))?
      .with_timezone(&Utc)
      .into();

    Ok(Self {
      _id: ObjectId::new(),
      author: item.author,
      email: item.email,
      date_created: DateTime::from(chrono_datetime),
      title: item.title,
      body: item.body,
      comments: [].to_vec()
    })
  }
}