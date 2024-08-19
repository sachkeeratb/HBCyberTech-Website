use actix_web::{post, web::{Data, Json}, HttpResponse};

use crate::{models::general_member::{GeneralMember, GeneralMemberRequest}, services::db::Database};

#[post("/general_member")]
pub async fn create_general_member(db: Data<Database>, request: Json<GeneralMemberRequest>) -> HttpResponse {
  match db
    .create_general_member(
      GeneralMember::try_from(GeneralMemberRequest {
        full_name: request.full_name.clone(),
        email: request.email.clone(),
        skills: request.skills.clone(),
        extra: request.extra.clone(),
        date_created: request.date_created.clone()
      })
      .expect("Error converting GeneralMemberRequest to GeneralMember.")
    ).await {
      Ok(gen_mem) => HttpResponse::Ok().json(gen_mem),
      Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}