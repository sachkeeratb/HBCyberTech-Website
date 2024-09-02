use chrono::Utc;
use lazy_static::lazy_static;
use mongodb::bson::{ oid::ObjectId, DateTime };
use regex::Regex;
use serde::{ Deserialize, Serialize };
use std::time::SystemTime;

// Store the regex patterns for various fields
lazy_static! {
	static ref RE_FULL_NAME: Regex = Regex::new(
		r"^[A-Za-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ ']{2,40}$"
	).unwrap();
	static ref RE_EMAIL: Regex = Regex::new(r"^[0-9]{6,7}@pdsb.net$").unwrap();
	static ref RE_EXTRA: Regex = Regex::new(r"^.{0,350}$").unwrap();
}

// Define the GeneralMember struct
#[derive(Serialize, Deserialize)]
pub struct GeneralMember {
	pub _id: ObjectId,
	pub full_name: String,
	pub email: String,
	pub grade: u8,
	pub skills: u8,
	pub extra: String,
	pub date_created: DateTime,
}

// Define the GeneralMemberRequest struct
#[derive(Serialize, Deserialize, Validate)]
pub struct GeneralMemberRequest {
	#[validate(regex(path = *RE_FULL_NAME, message = "Invalid name."))]
	pub full_name: String,
	#[validate(regex(path = *RE_EMAIL, message = "Email must be a valid PDSB email."))]
	pub email: String,
	#[validate(range(min = 9, max = 12, message = "Grade should be 9, 10, 11, or 12."))]
	pub grade: u8,
	#[validate(range(min = 0, max = 100, message = "Skills should be from 0 to 100."))]
	pub skills: u8,
	#[validate(regex(path = *RE_EXTRA, message = "Extra information should be from 0 to 350."))]
	pub extra: String,
	pub date_created: String,
}

// Implement the TryFrom trait for GeneralMemberRequest
impl TryFrom<GeneralMemberRequest> for GeneralMember {
	type Error = Box<dyn std::error::Error>;

	fn try_from(item: GeneralMemberRequest) -> Result<Self, Self::Error> {
		let chrono_datetime: SystemTime = chrono::DateTime
			::parse_from_rfc3339(&item.date_created)
			.map_err(|err| format!("Error parsing date: {err}"))?
			.with_timezone(&Utc)
			.into();

		Ok(Self {
			_id: ObjectId::new(),
			full_name: item.full_name,
			email: item.email,
			grade: item.grade,
			skills: item.skills,
			extra: item.extra,
			date_created: DateTime::from(chrono_datetime),
		})
	}
}
