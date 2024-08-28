use std::time::SystemTime;
use chrono::Utc;
use mongodb::bson::{self, doc, oid::ObjectId, DateTime};
use serde::{Serialize, Deserialize};
use lazy_static::lazy_static;
use regex::Regex;

lazy_static! {
  static ref RE_USERNAME: Regex = Regex::new(r"^^[a-zA-Z0-9._%+-]{2,20}$").unwrap();
  static ref RE_EMAIL: Regex = Regex::new(r"^[a-zA-Z0-9._%+-]+@pdsb.net$").unwrap();
  static ref RE_BODY: Regex = Regex::new(r"^.{20,600}$").unwrap();
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Comment {
  pub _id: ObjectId,
  pub author: String,
  pub email: String,
	pub date_created: DateTime,
	pub body: String
}

#[derive(Clone, Serialize, Deserialize, Validate)]
pub struct CommentRequest {
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
    path = *RE_BODY,
    message = "Invalid body length."
  ))]
	pub body: String
}

impl TryFrom<CommentRequest> for Comment {
  type Error = Box<dyn std::error::Error>;

  fn try_from(item: CommentRequest) -> Result<Self, Self::Error> {
    let chrono_datetime: SystemTime = chrono::DateTime::parse_from_rfc3339(&item.date_created)
      .map_err(|err| format!("Error parsing date: {err}"))?
      .with_timezone(&Utc)
      .into();

    Ok(Self {
      _id: ObjectId::new(),
      author: item.author,
      email: item.email,
      date_created: DateTime::from(chrono_datetime),
      body: item.body,
    })
  }
}

impl Comment {
  pub fn to_bson(&self) -> Result<bson::Document, Box<dyn std::error::Error>> {
    let doc = doc! {
      "_id": self._id.clone(),
      "author": self.author.clone(),
      "email": self.email.clone(),
      "date_created": self.date_created.clone(),
      "body": self.body.clone(),
    };
    Ok(doc)
  }
}