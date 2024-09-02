use crate::{
	models::{
		comment::{ Comment, CommentRequest },
		forum_post::{ Post, PostRequest, PostRequestRequest },
	},
	services::db::Database,
	utilities::{ claims::{ AdminClaims, UserClaims }, pagination_args::PaginationArgs },
};
use actix_web::{ delete, get, post, web::{ self, Data, Json }, HttpRequest, HttpResponse };
use bcrypt::{ hash, verify, DEFAULT_COST };
use chrono::Utc;
use jsonwebtoken::{ decode, DecodingKey, Validation };
use mongodb::bson::{ oid::ObjectId, Bson };
use std::cmp::Reverse;
use validator::Validate;

#[get("/forum/general/get/amount")]
pub async fn return_amount_of_posts(db: Data<Database>) -> HttpResponse {
	match db.get_amount_of_forum_posts().await {
		Ok(amount) => HttpResponse::Ok().json(amount),
		Err(_) => HttpResponse::Ok().json(0),
	}
}

#[get("/forum/general/post/{id}")]
pub async fn get_post_by_id(db: Data<Database>, id: web::Path<String>) -> HttpResponse {
	match db.get_forum_post_by_id(id.to_string()).await {
		Ok(Some(post)) =>
			HttpResponse::Ok().json(PostRequest {
				id: post._id.to_string(),
				author: post.author.clone(),
				email: post.email.clone(),
				date_created: post.date_created.to_string(),
				title: post.title.clone(),
				body: post.body.clone(),
				comments: post.comments.clone(),
			}),
		Ok(None) => HttpResponse::NotFound().body("Forum post not found."),
		Err(_) => HttpResponse::Ok().json(""),
	}
}

#[post("/forum/general/get")]
pub async fn return_posts(db: Data<Database>, request: Json<PaginationArgs>) -> HttpResponse {
	match
		db.get_forum_posts(
			request.page,
			request.limit,
			request.search.clone(),
			request.field.clone()
		).await
	{
		Ok(mut posts) => {
			posts.sort_by_key(|post| Reverse(post.date_created));
			let posts: Vec<PostRequest> = posts
				.into_iter()
				.map(|post| PostRequest {
					id: post._id.to_string(),
					author: post.author.clone(),
					email: post.email.clone(),
					date_created: post.date_created.to_string(),
					title: post.title.clone(),
					body: post.body.clone(),
					comments: [].to_vec(),
				})
				.collect();

			HttpResponse::Ok().json(posts)
		}
		Err(err) => {
			println!("{err}");
			HttpResponse::Ok().json("")
		}
	}
}

#[post("/forum/general/create")]
pub async fn create_post(db: Data<Database>, request: Json<PostRequestRequest>) -> HttpResponse {
	match request.validate() {
		Ok(_) => (),
		Err(err) => {
			return HttpResponse::BadRequest().body(err.to_string());
		}
	}

	match
		db.create_forum_post(
			Post::try_from(PostRequest {
				id: ObjectId::new().to_string(),
				author: request.author.clone(),
				email: request.email.clone(),
				date_created: request.date_created.clone(),
				title: request.title.clone(),
				body: request.body.clone(),
				comments: [].to_vec(),
			}).expect("Error converting PostRequest to Post.")
		).await
	{
		Ok(post) => HttpResponse::Ok().json(post),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}

#[post("/forum/general/post/{id}/comment")]
pub async fn post_comment(
	db: Data<Database>,
	id: web::Path<String>,
	request: Json<CommentRequest>
) -> HttpResponse {
	match request.validate() {
		Ok(_) => (),
		Err(err) => {
			return HttpResponse::BadRequest().body(err.to_string());
		}
	}

	match db.get_forum_post_by_id(id.to_string()).await {
		Ok(Some(mut post)) => {
			let comment = Comment::try_from(CommentRequest {
				author: request.author.clone(),
				email: request.email.clone(),
				date_created: request.date_created.clone(),
				body: request.body.clone(),
			}).expect("Error converting CommentRequest to Comment.");

			match comment.to_bson() {
				Ok(document) => {
					post.comments.push(mongodb::bson::Bson::Document(document));
					db.update_forum_post(id.to_string(), &post).await.expect("Error updating forum post.");
					HttpResponse::Ok().json(post)
				}
				Err(err) => {
					println!("Error converting Comment to Bson: {}", err);
					return HttpResponse::InternalServerError().body(err.to_string());
				}
			}
		}
		Ok(None) => HttpResponse::NotFound().body("Forum post not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}

#[post("/forum/general/post/{id}/comments")]
pub async fn get_comments_by_post_id(
	db: Data<Database>,
	id: web::Path<String>,
	request: Json<PaginationArgs>
) -> HttpResponse {
	let PaginationArgs { page, limit, search, field } = request.into_inner();
	match db.get_forum_post_by_id(id.to_string()).await {
		Ok(Some(post)) => {
			let skip = (page - 1) * limit;
			let comments: Vec<CommentRequest> = post.comments
				.into_iter()
				.rev()
				.skip(skip as usize)
				.take(limit as usize)
				.map(|comment| {
					let author = comment
						.as_document()
						.and_then(|doc| doc.get("author"))
						.and_then(Bson::as_str)
						.unwrap_or("")
						.to_string();
					let email = comment
						.as_document()
						.and_then(|doc| doc.get("email"))
						.and_then(Bson::as_str)
						.unwrap_or("")
						.to_string();
					let date_created = comment
						.as_document()
						.and_then(|doc| doc.get("date_created"))
						.and_then(|bson| Bson::as_datetime(bson))
						.map(|datetime| datetime.to_string())
						.unwrap_or_else(|| mongodb::bson::DateTime::now().to_string());
					let body = comment
						.as_document()
						.and_then(|doc| doc.get("body"))
						.and_then(Bson::as_str)
						.unwrap_or("")
						.to_string();
					CommentRequest {
						author,
						email,
						date_created,
						body,
					}
				})
				.filter(|comment| {
					match field.as_str() {
						"author" => comment.author.contains(&search),
						"email" => comment.email.contains(&search),
						_ => comment.author.contains(&search),
					}
				})
				.collect();

			HttpResponse::Ok().json(comments)
		}
		Ok(None) => HttpResponse::NotFound().body("Forum post not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}

#[delete("/forum/general/delete/{id}")]
pub async fn delete_post_as_user(
	db: web::Data<Database>,
	id: web::Path<String>,
	req: HttpRequest
) -> HttpResponse {
	let token = match req.headers().get("Authorization") {
		Some(header_value) => header_value.to_str().unwrap_or(""),
		None => {
			return HttpResponse::Unauthorized().body("Missing token");
		}
	};

	let claims = decode::<UserClaims>(
		token,
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

	match db.get_forum_post_by_id(id.to_string()).await {
		Ok(Some(post)) => {
			if post.author != claims.username {
				return HttpResponse::Unauthorized().body("You are not authorized to delete this post.");
			}
			match db.delete_forum_post(id.to_string()).await {
				Ok(_) => HttpResponse::Ok().body("Post deleted successfully."),
				Err(_) => HttpResponse::InternalServerError().body("Failed to delete post."),
			}
		}
		Ok(None) => HttpResponse::NotFound().body("Forum post not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}

#[delete("/forum/general/delete/as_admin/{id}")]
pub async fn delete_post_as_admin(
	db: Data<Database>,
	id: web::Path<String>,
	req: HttpRequest
) -> HttpResponse {
	let token = match req.headers().get("Authorization") {
		Some(header_value) => header_value.to_str().unwrap_or(""),
		None => {
			return HttpResponse::Unauthorized().body("Missing token");
		}
	};

	let claims = decode::<AdminClaims>(
		token,
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

	match db.get_forum_post_by_id(id.to_string()).await {
		Ok(Some(_)) =>
			match db.delete_forum_post(id.to_string()).await {
				Ok(_) => HttpResponse::Ok().body("Post deleted successfully."),
				Err(_) => HttpResponse::InternalServerError().body("Failed to delete post."),
			}
		Ok(None) => HttpResponse::NotFound().body("Forum post not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}
