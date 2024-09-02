use std::env::var;
use chrono::Utc;
use lazy_static::lazy_static;
use mongodb::bson::{ oid::ObjectId, DateTime };
use regex::Regex;
use serde::{ Deserialize, Serialize };
use std::time::SystemTime;
use validator::ValidationError;

// Store the regex patterns for username and email
lazy_static! {
	static ref RE_USERNAME: Regex = Regex::new(r"^[a-zA-Z0-9._%+-]{2,20}$").unwrap();
	static ref RE_EMAIL: Regex = Regex::new(r"^[0-9]{6,7}@pdsb.net$").unwrap();
}

// Define the Account struct
#[derive(Serialize, Deserialize)]
pub struct Account {
	pub _id: ObjectId,
	pub username: String,
	pub email: String,
	pub password: String,
	pub verified: bool,
	pub date_created: DateTime,
}

// Create functions to validate the username and email
fn validate_username(username: &String) -> Result<(), ValidationError> {
	if !RE_USERNAME.is_match(username) && username != "The Team" {
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

// Define the AccountRequest struct
#[derive(Serialize, Deserialize, Validate)]
pub struct AccountRequest {
	#[validate(custom(function = "validate_username"))]
	pub username: String,
	#[validate(custom(function = "validate_email"))]
	pub email: String,
	pub password: String,
	pub verified: bool,
	pub date_created: String,
}

// Implement the TryFrom trait for AccountRequest
impl TryFrom<AccountRequest> for Account {
	type Error = Box<dyn std::error::Error>;

	fn try_from(item: AccountRequest) -> Result<Self, Self::Error> {
		let chrono_datetime: SystemTime = chrono::DateTime
			::parse_from_rfc3339(&item.date_created)
			.map_err(|err| format!("Error parsing date: {err}"))?
			.with_timezone(&Utc)
			.into();

		Ok(Self {
			_id: ObjectId::new(),
			username: item.username,
			email: item.email,
			password: item.password,
			verified: item.verified,
			date_created: DateTime::from(chrono_datetime),
		})
	}
}
