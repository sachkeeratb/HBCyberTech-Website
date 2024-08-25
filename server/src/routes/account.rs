use actix_web::{get, post, web::{self, Data, Json}, HttpResponse};
use validator::Validate;

use crate::{models::account::{Account, AccountRequest}, services::db::Database};

#[get("/account/get/{username_or_email}")]
pub async fn get_account_by_username_or_email(db: Data<Database>, username_or_email: web::Path<String>) -> HttpResponse {
  match db.account_does_exist_full_name(username_or_email.to_string()).await {
    true => HttpResponse::Ok().json(username_or_email.to_string()),
    false => match db.account_does_exist_email(username_or_email.to_string()).await {
      true => HttpResponse::Ok().json(username_or_email.to_string()),
      false => HttpResponse::Ok().json("")
    }
  }
}

#[post("/account/post")]
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
        password: request.password.clone(),
        verified: request.verified.clone(),
        date_created: request.date_created.clone()
      })
      .expect("Error converting AccountRequest to Account.")
    ).await {
      Ok(acc) => HttpResponse::Ok().json(acc),
      Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}