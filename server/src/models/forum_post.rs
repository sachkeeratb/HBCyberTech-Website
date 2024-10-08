use std::env::var;
use chrono::Utc;
use lazy_static::lazy_static;
use mongodb::bson::{ oid::ObjectId, Array, DateTime };
use regex::Regex;
use serde::{ Deserialize, Serialize };
use std::time::SystemTime;
use validator::ValidationError;

// Store the regex patterns for various fields
lazy_static! {
	static ref RE_USERNAME: Regex = Regex::new(r"^^[a-zA-Z0-9._%+-]{2,20}$").unwrap();
	static ref RE_EMAIL: Regex = Regex::new(r"^[0-9]{6,7}@pdsb.net$").unwrap();
	static ref RE_TITLE: Regex = Regex::new(r"^.{5,20}$").unwrap();
	static ref RE_BODY: Regex = Regex::new(r"^.{20,600}$").unwrap();
}

// Define the Post struct
#[derive(Serialize, Deserialize)]
pub struct Post {
	pub _id: ObjectId,
	pub author: String,
	pub email: String,
	pub date_created: DateTime,
	pub title: String,
	pub body: String,
	pub comments: Array,
}

// Create functions to validate the author and email
fn validate_author(author: &String) -> Result<(), ValidationError> {
	if !RE_USERNAME.is_match(author) && author != "The Team" {
		return Err(ValidationError::new("Invalid username."));
	}
	Ok(())
}

fn validate_email(email: &String) -> Result<(), ValidationError> {
	if !RE_EMAIL.is_match(email) && email != &format!("{}@gmail.com", var("EMAIL_NAME").unwrap()) {
		return Err(ValidationError::new("Email must be a valid PDSB email."));
	}
	Ok(())
}

// Define the PostRequest struct
#[derive(Serialize, Deserialize, Validate)]
pub struct PostRequest {
	pub id: String,
	#[validate(custom(function = "validate_author"))]
	pub author: String,
	#[validate(custom(function = "validate_email"))]
	pub email: String,
	pub date_created: String,
	#[validate(regex(path = *RE_TITLE, message = "Invalid title length."))]
	pub title: String,
	#[validate(regex(path = *RE_BODY, message = "Invalid body length."))]
	pub body: String,
	pub comments: Array,
}

// Define the PostRequestRequest struct (no id)
#[derive(Serialize, Deserialize, Validate)]
pub struct PostRequestRequest {
	#[validate(custom(function = "validate_author"))]
	pub author: String,
	#[validate(custom(function = "validate_email"))]
	pub email: String,
	pub date_created: String,
	#[validate(regex(path = *RE_TITLE, message = "Invalid title length."))]
	pub title: String,
	#[validate(regex(path = *RE_BODY, message = "Invalid body length."))]
	pub body: String,
}

// Implement the TryFrom trait for PostRequest
impl TryFrom<PostRequest> for Post {
	type Error = Box<dyn std::error::Error>;

	fn try_from(item: PostRequest) -> Result<Self, Self::Error> {
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
			comments: [].to_vec(),
		})
	}
}
