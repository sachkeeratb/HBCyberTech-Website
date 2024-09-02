use serde::{ Deserialize, Serialize };

#[derive(Serialize, Deserialize)]
pub struct UserClaims {
	pub username: String,
	pub email: String,
	pub verified: bool,
	pub exp: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AdminClaims {
	pub token: String,
	pub exp: usize,
}

#[derive(Serialize, Deserialize)]
pub struct Token {
	pub token: String,
}
