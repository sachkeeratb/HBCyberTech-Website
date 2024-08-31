use actix_web::{post, web::{self, Data}, HttpResponse};
use bcrypt::verify;
use chrono::{DateTime, Duration, Utc};
use serde::{Deserialize, Serialize};
use serde_json::json;
use jsonwebtoken::{encode, Header, EncodingKey};

use crate::services::db::Database;
use jsonwebtoken::{decode, DecodingKey, Validation};

#[derive(Serialize, Deserialize)]
struct Claims {
	token: String,
	exp: usize,
}

#[derive(Serialize, Deserialize)]
struct Given {
  password: String
}

#[post("/admin/verify")]
pub async fn verify_admin(db: Data<Database>, request: web::Json<Claims>) -> HttpResponse { 
	match decode::<Claims>(&request.token, &DecodingKey::from_secret(dotenv!("SECRET").as_ref()), &Validation::default()) {
		Ok(decoded) => {
			// JWT successfully decoded
			let token = decoded.claims.token;
			let exp = decoded.claims.exp;
			let now = Utc::now().timestamp() as usize;
			
			if now <= exp || token == db.get_admin_hashed_password().await.unwrap() {
				return HttpResponse::Ok().json(json!({ "valid": true }));
			}
			
			HttpResponse::Ok().json(json!({ "valid": false }))
		},
		// Failed to decode JWT
		Err(err) => {
			HttpResponse::BadRequest().body(err.to_string())
		}
	}
}

#[post("/admin/signin")]
pub async fn admin_sign_in(db: Data<Database>, request: web::Json<Given>) -> HttpResponse { 
  let admin = db.get_admin().await.unwrap();

	if DateTime::<Utc>::from_timestamp_millis(admin.last_reset.timestamp_millis()).unwrap() < (Utc::now() - Duration::hours(6)) {
		db.update_admin().await.unwrap();
	}

	let password = db.get_admin_hashed_password().await;

	match password {
		Ok(password) => {
			if verify(&request.password, &password).unwrap() {
				let claims = Claims {
					token: password,
					exp: (chrono::Utc::now() + chrono::Duration::hours(1)).timestamp() as usize,
				};
				let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(dotenv!("SECRET").as_ref())).unwrap();
				HttpResponse::Ok().json(json!({ "token": token }))
			} else {
				HttpResponse::Ok().json("")
			}
		},
		Err(_) => HttpResponse::InternalServerError().body("Failed to retrieve password.")
	}
}