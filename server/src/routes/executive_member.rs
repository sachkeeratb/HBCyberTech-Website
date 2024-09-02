use crate::{
	models::executive_member::{ ExecutiveMember, ExecutiveMemberRequest },
	services::db::Database,
	utilities::pagination_args::AdminPaginationArgs,
};
use actix_web::{ get, post, web::{ self, Data, Json }, HttpResponse };
use bcrypt::{ hash, verify, DEFAULT_COST };
use validator::Validate;

#[get("/executive_member/get/{full_name_or_email}")]
pub async fn get_executive_member_by_full_name_or_email(
	db: Data<Database>,
	full_name_or_email: web::Path<String>
) -> HttpResponse {
	match db.exec_mem_does_exist_full_name(full_name_or_email.to_string()).await {
		true => HttpResponse::Ok().json(full_name_or_email.to_string()),
		false =>
			match db.exec_mem_does_exist_email(full_name_or_email.to_string()).await {
				true => HttpResponse::Ok().json(full_name_or_email.to_string()),
				false => HttpResponse::Ok().json(""),
			}
	}
}

#[post("/executive_member/get_all")]
pub async fn get_all_executive_members(
	db: Data<Database>,
	request: Json<AdminPaginationArgs>
) -> HttpResponse {
	if
		!verify(
			request.token.clone(),
			hash(db.get_admin().await.unwrap().token.to_string(), DEFAULT_COST).unwrap().as_str()
		).unwrap()
	{
		return HttpResponse::Unauthorized().body("Unauthorized.");
	}

	match
		db.get_all_executive_members(
			request.page,
			request.limit,
			request.search.clone(),
			request.field.clone()
		).await
	{
		Ok(members) => {
			let executive_members: Vec<ExecutiveMemberRequest> = members
				.into_iter()
				.rev()
				.map(|member| ExecutiveMemberRequest {
					full_name: member.full_name.clone(),
					email: member.email.clone(),
					grade: member.grade.clone(),
					exec_type: member.exec_type.clone(),
					why: member.why.clone(),
					experience: member.experience.clone(),
					portfolio: member.portfolio.clone(),
					extra: member.extra.clone(),
					date_created: member.date_created.to_string(),
				})
				.collect();
			HttpResponse::Ok().json(executive_members)
		}
		Err(_) => HttpResponse::InternalServerError().body("Error getting general members."),
	}
}

#[post("/executive_member/post")]
pub async fn create_executive_member(
	db: Data<Database>,
	request: Json<ExecutiveMemberRequest>
) -> HttpResponse {
	match request.validate() {
		Ok(_) => (),
		Err(err) => {
			return HttpResponse::BadRequest().body(err.to_string());
		}
	}

	match
		db.create_executive_member(
			ExecutiveMember::try_from(ExecutiveMemberRequest {
				full_name: request.full_name.clone(),
				email: request.email.clone(),
				grade: request.grade.clone(),
				exec_type: request.exec_type.clone(),
				why: request.why.clone(),
				experience: request.experience.clone(),
				portfolio: request.portfolio.clone(),
				extra: request.extra.clone(),
				date_created: request.date_created.clone(),
			}).expect("Error converting ExecutiveMemberRequest to ExecutiveMember.")
		).await
	{
		Ok(exec_mem) => HttpResponse::Ok().json(exec_mem),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}
