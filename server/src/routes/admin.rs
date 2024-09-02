use actix_web::{ post, web::{ self, Data }, HttpResponse };
use bcrypt::{ hash, verify, DEFAULT_COST };
use chrono::{ DateTime, Duration, Local, Utc };
use jsonwebtoken::{ decode, encode, DecodingKey, EncodingKey, Header, Validation };
use serde::{ Deserialize, Serialize };
use serde_json::json;

use crate::{ services::db::Database, utilities::claims::{ AdminClaims, Token } };

#[derive(Serialize, Deserialize)]
struct Given {
	password: String,
}

#[post("/admin/verify")]
pub async fn verify_admin(db: Data<Database>, request: web::Json<Token>) -> HttpResponse {
	match
		decode::<AdminClaims>(
			&request.token,
			&DecodingKey::from_secret(dotenv!("SECRET").as_ref()),
			&Validation::default()
		)
	{
		Ok(decoded) => {
			// JWT successfully decoded
			let token = decoded.claims.token;
			let exp = decoded.claims.exp;
			let now = Utc::now().timestamp() as usize;

			if
				now <= exp &&
				verify(
					token,
					hash(db.get_admin().await.unwrap().token.to_string(), DEFAULT_COST).unwrap().as_str()
				).unwrap()
			{
				return HttpResponse::Ok().json(true);
			}

			HttpResponse::Ok().json(false)
		}
		// Failed to decode JWT
		Err(err) => HttpResponse::BadRequest().body(err.to_string()),
	}
}

#[post("/admin/signin")]
pub async fn admin_sign_in(db: Data<Database>, request: web::Json<Given>) -> HttpResponse {
	let admin = db.get_admin().await.unwrap();
	if
		DateTime::<Utc>::from_timestamp_millis(admin.last_reset.timestamp_millis()).unwrap() <
		Utc::now() - Duration::hours(6)
	{
		db.update_admin().await.unwrap();
	}

	let admin = db.get_admin().await.unwrap();

	match verify(request.password.clone(), hash(admin.password, DEFAULT_COST).unwrap().as_str()) {
		Ok(matches) => {
			if !matches {
				return HttpResponse::Ok().json("");
			}
			let claims = AdminClaims {
				token: admin.token.to_string(),
				exp: (Utc::now() + Duration::hours(1)).timestamp() as usize,
			};
			let token = encode(
				&Header::default(),
				&claims,
				&EncodingKey::from_secret(dotenv!("SECRET").as_ref())
			).unwrap();
			println!("Sign in at {}", Local::now());
			return HttpResponse::Ok().json(json!({ "token": token }));
		}
		Err(err) => {
			return HttpResponse::InternalServerError().body(err.to_string());
		}
	}
}
