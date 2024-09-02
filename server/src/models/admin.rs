use std::time::SystemTime;
use chrono::Utc;
use mongodb::bson::{ oid::ObjectId, DateTime, Uuid };
use serde::{ Serialize, Deserialize };

// Define the Admin struct
#[derive(Serialize, Deserialize)]
pub struct Admin {
	pub _id: ObjectId,
	pub token: Uuid,
	pub password: String,
	pub last_reset: DateTime,
}

// Define the AdminRequest struct
#[derive(Serialize, Deserialize)]
pub struct AdminRequest {
	pub token: String,
	pub password: String,
	pub last_reset: String,
}

// Implement the TryFrom trait for AdminRequest
impl TryFrom<AdminRequest> for Admin {
	type Error = Box<dyn std::error::Error>;

	fn try_from(item: AdminRequest) -> Result<Self, Self::Error> {
		let chrono_datetime: SystemTime = chrono::DateTime
			::parse_from_rfc3339(&item.last_reset)
			.map_err(|err| format!("Error parsing date: {err}"))?
			.with_timezone(&Utc)
			.into();

		Ok(Self {
			_id: ObjectId::new(),
			token: Uuid::new(),
			password: item.password,
			last_reset: DateTime::from(chrono_datetime),
		})
	}
}
