use crate::models::announcement::AnnouncementRequestRequest;
use crate::utilities::claims::AdminClaims;
use crate::{ models::announcement::Announcement, services::db::Database };
use crate::{
	models::announcement::AnnouncementRequest,
	utilities::pagination_args::PaginationArgs,
};
use actix_web::{ delete, web, HttpRequest };
use actix_web::{ get, post, web::{ Data, Json }, HttpResponse };
use bcrypt::{ hash, verify, DEFAULT_COST };
use chrono::Utc;
use jsonwebtoken::{ decode, DecodingKey, Validation };
use mongodb::bson::oid::ObjectId;
use std::cmp::Reverse;

// Return the amount of announcements
#[get("/forum/announcements/get/amount")]
pub async fn return_amount_of_announcements(db: Data<Database>) -> HttpResponse {
	match db.get_amount_of_announcements().await {
		Ok(amount) => HttpResponse::Ok().json(amount),
		Err(_) => HttpResponse::Ok().json(0),
	}
}

// Return the announcements with pagination
#[post("/forum/announcements/get")]
pub async fn return_announcements(
	db: Data<Database>,
	request: Json<PaginationArgs>
) -> HttpResponse {
	// Get the paginated announcements
	match
		db.get_announcements(
			request.page,
			request.limit,
			request.search.clone(),
			request.field.clone()
		).await
	{
		Ok(mut posts) => {
			// Sort the posts by date_created in descending order
			posts.sort_by_key(|post| Reverse(post.date_created));
			let announcements: Vec<AnnouncementRequest> = posts
				.into_iter()
				.map(|post| AnnouncementRequest {
					id: post._id.to_string(),
					author: post.author.clone(),
					email: post.email.clone(),
					date_created: post.date_created.to_string(),
					title: post.title.clone(),
					body: post.body.clone(),
				})
				.collect();

			HttpResponse::Ok().json(announcements)
		}
		Err(_) => HttpResponse::Ok().json(""),
	}
}

// Create an announcement
#[post("/forum/announcements/create")]
pub async fn create_announcement(
	db: Data<Database>,
	request: Json<AnnouncementRequestRequest>
) -> HttpResponse {
	let claims = decode::<AdminClaims>(
		&request.token,
		&DecodingKey::from_secret(dotenv!("SECRET").as_ref()),
		&Validation::default()
	);

	let claims = match claims {
		Ok(data) => data.claims,
		Err(err) => {
			println!("Error decoding token: {}", err);
			return HttpResponse::Unauthorized().body("Invalid token");
		}
	};

	// JWT successfully decoded
	let token = claims.token;
	let exp = claims.exp;
	let now = Utc::now().timestamp() as usize;

	if
		!(
			now <= exp &&
			verify(
				token,
				hash(db.get_admin().await.unwrap().token.to_string(), DEFAULT_COST).unwrap().as_str()
			).unwrap()
		)
	{
		return HttpResponse::BadRequest().body("Invalid token.");
	}

	// Create the announcement
	match
		db.create_announcement(
			Announcement::try_from(AnnouncementRequest {
				id: ObjectId::new().to_string(),
				author: "The Team".to_string(),
				email: format!("{}@gmail.com", dotenv!("EMAIL_NAME")),
				date_created: request.date_created.clone(),
				title: request.title.clone(),
				body: request.body.clone(),
			}).expect("Error converting PostRequest to Post.")
		).await
	{
		Ok(post) => HttpResponse::Ok().json(post),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}

// Delete an announcement
#[delete("/forum/announcements/delete/{id}")]
pub async fn delete_announcement(
	db: Data<Database>,
	id: web::Path<String>,
	req: HttpRequest
) -> HttpResponse {
	// Get the token
	let token = match req.headers().get("Authorization") {
		Some(header_value) => header_value.to_str().unwrap_or(""),
		None => {
			return HttpResponse::Unauthorized().body("Missing token");
		}
	};

	// Decode the JWT
	let claims = decode::<AdminClaims>(
		token,
		&DecodingKey::from_secret(dotenv!("SECRET").as_ref()),
		&Validation::default()
	);

	// Get the claims
	let claims = match claims {
		Ok(data) => data.claims,
		Err(err) => {
			println!("Error decoding token: {}", err);
			return HttpResponse::Unauthorized().body("Invalid token");
		}
	};

	// JWT successfully decoded
	let token = claims.token;
	let exp = claims.exp;
	let now = Utc::now().timestamp() as usize;

	// Verify the token
	if
		!(
			now <= exp &&
			verify(
				token,
				hash(db.get_admin().await.unwrap().token.to_string(), DEFAULT_COST).unwrap().as_str()
			).unwrap()
		)
	{
		return HttpResponse::BadRequest().body("Invalid token.");
	}

	// Delete the announcement
	match db.get_announcement_by_id(id.to_string()).await {
		Ok(Some(_)) =>
			match db.delete_announcement(id.to_string()).await {
				Ok(_) => HttpResponse::Ok().body("Announcement deleted successfully."),
				Err(_) => HttpResponse::InternalServerError().body("Failed to delete post."),
			}
		Ok(None) => HttpResponse::NotFound().body("Announcement not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}
