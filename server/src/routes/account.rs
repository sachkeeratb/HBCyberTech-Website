use actix_web::{get, web::{self, Data}, HttpResponse};

use crate::services::db::Database;

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