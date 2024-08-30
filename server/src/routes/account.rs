use actix_web::{get, post, web::{self, Data, Json}, HttpResponse};
use mail_send::SmtpClientBuilder;
use mail_builder::MessageBuilder;
use validator::Validate;
use serde::{Deserialize, Serialize};
use serde_json::json;
use bcrypt::{hash, verify, DEFAULT_COST};
use jsonwebtoken::{encode, Header, EncodingKey};

use crate::{models::account::{Account, AccountRequest}, services::db::Database};

#[derive(Deserialize)]
struct AccountGiven {
  email: String,
  password: String
}

#[derive(Serialize, Deserialize)]
struct Claims {
	username: String,
	email: String,
	verified: bool,
	exp: usize,
}

async fn check_account_exists(db: &Database, username_or_email: &str) -> bool {
	match db.account_does_exist_full_name(username_or_email.to_string()).await {
		true => true,
		false => match db.account_does_exist_email(username_or_email.to_string()).await {
			true => true,
			false => false
		}
	}
}

#[get("/account/get/{username_or_email}")]
pub async fn get_account_by_username_or_email(db: Data<Database>, full_name_or_email: web::Path<String>) -> HttpResponse {
  match db.account_does_exist_full_name(full_name_or_email.to_string()).await {
		true => HttpResponse::Ok().json(full_name_or_email.to_string()),
		false => match db.account_does_exist_email(full_name_or_email.to_string()).await {
			true => HttpResponse::Ok().json(full_name_or_email.to_string()),
			false => HttpResponse::Ok().json("")
		}
  }
}

#[get("/account/verify/{id}")]
pub async fn verify_account(db: Data<Database>, id: web::Path<String>) -> HttpResponse {
	match db.verify_account(id.to_string()).await {
		Ok(_) => HttpResponse::Ok().json("Account verified."),
		Err(_) => HttpResponse::Ok().json("Account not found.")
	}
}

#[post("/account/post/signin")]
pub async fn sign_in(db: Data<Database>, request: web::Json<AccountGiven>) -> HttpResponse {
	if !check_account_exists(&db, &request.email).await {
		return HttpResponse::NotFound().json("Account does not exist.");
	}

	let password_option = db.get_account_password_by_email(request.email.clone()).await;

	match password_option {
		Ok(Some(password_option)) => {
			match verify(&request.password, &password_option) {
				Ok(matches) => {
					if matches {
						let account = db.get_account_by_email(request.email.clone()).await.unwrap();
						let claims = Claims {
							username: account.as_ref().unwrap().username.clone(),
							email: account.as_ref().unwrap().email.clone(),
							verified: account.as_ref().unwrap().verified.clone(),
							exp: (chrono::Utc::now() + chrono::Duration::hours(24)).timestamp() as usize,
					};
					let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(dotenv!("SECRET").as_ref())).unwrap();
					HttpResponse::Ok().json(json!({ "token": token }))
					} else {
						HttpResponse::Ok().json("")
					}
				},
				Err(err) => HttpResponse::InternalServerError().body(err.to_string())
			}
		},
		_err => HttpResponse::InternalServerError().body("Failed to retrieve password.")
	}
}

#[post("/account/post/signup")]
pub async fn create_account(db: Data<Database>, request: Json<AccountRequest>) -> HttpResponse {
  match request.validate() {
	Ok(_) => (),
	Err(err) => return HttpResponse::BadRequest().body(err.to_string())
  }
  
  match db
	.create_account(
	  Account::try_from(AccountRequest {
			username: request.username.clone(),
			email: request.email.clone(),
			password: hash(&request.password, DEFAULT_COST).unwrap(),
			verified: request.verified.clone(),
			date_created: request.date_created.clone()
	  })
	  .expect("Error converting AccountRequest to Account.")
	).await {
	  Ok(acc) => {
			let object_id = acc.inserted_id.to_string();
			let verify_url = format!("http://{}:{}/account/verify/{}", dotenv!("HOST"), dotenv!("PORT"), &object_id[10..object_id.len() - 2]);
			let message = MessageBuilder::new()
				.from(("HB CyberTech".to_owned(), dotenv!("EMAIL_NAME").to_string() + "@gmail.com"))
				.to(request.email.clone())
				.subject("Please verify your account!")
				.html_body(format!("<h1>Verify your account!</h1><a href=\"{}\">{}</a>", verify_url, verify_url))
				.text_body(format!("Verify your account at the following link: {}", verify_url));
	
			SmtpClientBuilder::new("smtp.gmail.com", 587)
				.implicit_tls(false)
				.credentials((dotenv!("EMAIL_NAME"), dotenv!("EMAIL_PASSWORD")))
				.connect()
				.await
				.unwrap()
				.send(message)
				.await
				.unwrap();
			HttpResponse::Ok().json(acc)
		},
	  Err(err) => HttpResponse::InternalServerError().body(err.to_string())
	}
}