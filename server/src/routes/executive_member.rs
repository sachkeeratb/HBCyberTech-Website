use actix_web::{get, post, web::{ self, Data, Json}, HttpResponse};
use validator::Validate;
use crate::{models::executive_member::{ExecutiveMember, ExecutiveMemberRequest}, services::db::Database};

#[get("/executive_member/get/{full_name_or_email}")]
pub async fn get_executive_member_by_full_name_or_email(db: Data<Database>, full_name_or_email: web::Path<String>) -> HttpResponse {
  match db.exec_mem_does_exist_full_name(full_name_or_email.to_string()).await {
    true => HttpResponse::Ok().json(full_name_or_email.to_string()),
    false => match db.exec_mem_does_exist_email(full_name_or_email.to_string()).await {
      true => HttpResponse::Ok().json(full_name_or_email.to_string()),
      false => HttpResponse::Ok().json("")
    }
  }
}

#[post("/executive_member/post")]
pub async fn create_executive_member(db: Data<Database>, request: Json<ExecutiveMemberRequest>) -> HttpResponse {
  match request.validate() {
    Ok(_) => (),
    Err(err) => return HttpResponse::BadRequest().body(err.to_string())
  }
  
  match db
    .create_executive_member(
      ExecutiveMember::try_from(ExecutiveMemberRequest {
        full_name: request.full_name.clone(),
        email: request.email.clone(),
        exec_type: request.exec_type.clone(),
        why: request.why.clone(),
        experience: request.experience.clone(),
        portfolio: request.portfolio.clone(),
        extra: request.extra.clone(),
        date_created: request.date_created.clone()
      })
      .expect("Error converting ExecutiveMemberRequest to ExecutiveMember.")
    ).await {
      Ok(exec_mem) => HttpResponse::Ok().json(exec_mem),
      Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}