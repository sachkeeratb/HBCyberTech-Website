use std::env::var;
use chrono::Utc;
use mongodb::bson::{ oid::ObjectId, DateTime };
use serde::{ Deserialize, Serialize };
use std::time::SystemTime;
use validator::ValidationError;

// Define the Announcement struct
#[derive(Serialize, Deserialize)]
pub struct Announcement {
	pub _id: ObjectId,
	pub author: String,
	pub email: String,
	pub date_created: DateTime,
	pub title: String,
	pub body: String,
}

// Create functions to validate the author and email
fn validate_author(author: &String) -> Result<(), ValidationError> {
	if author != "The Team" {
		return Err(ValidationError::new("Invalid username."));
	}
	Ok(())
}

fn validate_email(email: &String) -> Result<(), ValidationError> {
	if email != &format!("{}@gmail.com", var("EMAIL_NAME").unwrap()) {
		return Err(ValidationError::new("Email must be a valid PDSB email."));
	}
	Ok(())
}

// Define the AnnouncementRequest struct
#[derive(Serialize, Deserialize, Validate)]
pub struct AnnouncementRequest {
	pub id: String,
	#[validate(custom(function = "validate_author"))]
	pub author: String,
	#[validate(custom(function = "validate_email"))]
	pub email: String,
	pub date_created: String,
	pub title: String,
	pub body: String,
}

// Define the AnnouncementRequestRequest struct (no id with token)
#[derive(Serialize, Deserialize, Validate)]
pub struct AnnouncementRequestRequest {
	#[validate(custom(function = "validate_author"))]
	pub author: String,
	#[validate(custom(function = "validate_email"))]
	pub email: String,
	pub date_created: String,
	pub title: String,
	pub body: String,
	pub token: String,
}

// Implement the TryFrom trait for AnnouncementRequest
impl TryFrom<AnnouncementRequest> for Announcement {
	type Error = Box<dyn std::error::Error>;

	fn try_from(item: AnnouncementRequest) -> Result<Self, Self::Error> {
		let chrono_datetime: SystemTime = chrono::DateTime
			::parse_from_rfc3339(&item.date_created)
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
		})
	}
}
