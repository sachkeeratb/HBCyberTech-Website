use actix_web::{get, post, web::{ self, Data, Json}, HttpResponse};
use validator::Validate;

use crate::{models::general_member::{GeneralMember, GeneralMemberRequest}, services::db::Database};

#[get("/general_member/get/{full_name_or_email}")]
pub async fn get_general_member_by_full_name_or_email(db: Data<Database>, full_name_or_email: web::Path<String>) -> HttpResponse {
  match db.gen_mem_does_exist_full_name(full_name_or_email.to_string()).await {
    true => HttpResponse::Ok().json(full_name_or_email.to_string()),
    false => match db.gen_mem_does_exist_email(full_name_or_email.to_string()).await {
      true => HttpResponse::Ok().json(full_name_or_email.to_string()),
      false => HttpResponse::Ok().json("")
    }
  }
}

#[post("/general_member/post")]
pub async fn create_general_member(db: Data<Database>, request: Json<GeneralMemberRequest>) -> HttpResponse {
  match request.validate() {
    Ok(_) => (),
    Err(err) => return HttpResponse::BadRequest().body(err.to_string())
  }
  
  match db
    .create_general_member(
      GeneralMember::try_from(GeneralMemberRequest {
        full_name: request.full_name.clone(),
        email: request.email.clone(),
        grade: request.grade.clone(),
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