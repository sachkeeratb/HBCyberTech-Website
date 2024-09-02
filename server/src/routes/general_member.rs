use actix_web::{ get, post, web::{ self, Data, Json }, HttpResponse };
use bcrypt::{ hash, verify, DEFAULT_COST };
use validator::Validate;

use crate::{
	models::general_member::{ GeneralMember, GeneralMemberRequest },
	services::db::Database,
	utilities::pagination_args::AdminPaginationArgs,
};

// Get the general member by full name or email
#[get("/general_member/get/{full_name_or_email}")]
pub async fn get_general_member_by_full_name_or_email(
	db: Data<Database>,
	full_name_or_email: web::Path<String>
) -> HttpResponse {
	match db.gen_mem_does_exist_full_name(full_name_or_email.to_string()).await {
		true => HttpResponse::Ok().json(full_name_or_email.to_string()),
		false =>
			match db.gen_mem_does_exist_email(full_name_or_email.to_string()).await {
				true => HttpResponse::Ok().json(full_name_or_email.to_string()),
				false => HttpResponse::Ok().json(""),
			}
	}
}

// Get all general members
#[post("/general_member/get_all")]
pub async fn get_all_general_members(
	db: Data<Database>,
	request: Json<AdminPaginationArgs>
) -> HttpResponse {
	// Verify the admin token
	if
		!verify(
			request.token.clone(),
			hash(db.get_admin().await.unwrap().token.to_string(), DEFAULT_COST).unwrap().as_str()
		).unwrap()
	{
		return HttpResponse::Unauthorized().body("Unauthorized.");
	}

	// Get the paginated general members
	match
		db.get_all_general_members(
			request.page,
			request.limit,
			request.search.clone(),
			request.field.clone()
		).await
	{
		Ok(members) => {
			// Sort the members by date_created in descending order
			let general_members: Vec<GeneralMemberRequest> = members
				.into_iter()
				.rev()
				.map(|member| GeneralMemberRequest {
					full_name: member.full_name.clone(),
					email: member.email.clone(),
					grade: member.grade.clone(),
					skills: member.skills.clone(),
					extra: member.extra.clone(),
					date_created: member.date_created.to_string(),
				})
				.collect();
			HttpResponse::Ok().json(general_members)
		}
		Err(_) => HttpResponse::InternalServerError().body("Error getting general members."),
	}
}

// Create a general member
#[post("/general_member/post")]
pub async fn create_general_member(
	db: Data<Database>,
	request: Json<GeneralMemberRequest>
) -> HttpResponse {
	// Validate the request
	match request.validate() {
		Ok(_) => (),
		Err(err) => {
			return HttpResponse::BadRequest().body(err.to_string());
		}
	}

	// Create the general member
	match
		db.create_general_member(
			GeneralMember::try_from(GeneralMemberRequest {
				full_name: request.full_name.clone(),
				email: request.email.clone(),
				grade: request.grade.clone(),
				skills: request.skills.clone(),
				extra: request.extra.clone(),
				date_created: request.date_created.clone(),
			}).expect("Error converting GeneralMemberRequest to GeneralMember.")
		).await
	{
		Ok(gen_mem) => HttpResponse::Ok().json(gen_mem),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}
