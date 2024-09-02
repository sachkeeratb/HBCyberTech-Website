use serde::{ Deserialize, Serialize };

// Define the UserClaims struct
#[derive(Serialize, Deserialize)]
pub struct UserClaims {
	pub username: String,
	pub email: String,
	pub verified: bool,
	pub exp: usize,
}

// Define the AdminClaims struct
#[derive(Serialize, Deserialize)]
pub struct AdminClaims {
	pub token: String,
	pub exp: usize,
}

// Define the Token struct
#[derive(Serialize, Deserialize)]
pub struct Token {
	pub token: String,
}
