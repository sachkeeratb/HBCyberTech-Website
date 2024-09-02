use std::env::var;
use crate::{
	models::{
		comment::{ Comment, CommentRequest, CommentRequestRequest },
		forum_post::{ Post, PostRequest, PostRequestRequest },
	},
	services::db::Database,
	utilities::{ claims::{ AdminClaims, UserClaims }, pagination_args::PaginationArgs },
};
use actix_web::{ delete, get, post, web::{ self, Data, Json }, HttpRequest, HttpResponse };
use bcrypt::{ hash, verify, DEFAULT_COST };
use chrono::Utc;
use jsonwebtoken::{ decode, DecodingKey, Validation };
use mongodb::bson::{ oid::ObjectId, Bson, DateTime };
use std::cmp::Reverse;
use validator::Validate;

// Return the amount of forum posts
#[get("/forum/general/get/amount")]
pub async fn return_amount_of_posts(db: Data<Database>) -> HttpResponse {
	match db.get_amount_of_forum_posts().await {
		Ok(amount) => HttpResponse::Ok().json(amount),
		Err(_) => HttpResponse::Ok().json(0),
	}
}

// Get the forum post by id
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

// Return the forum posts with pagination, reversed
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

// Create a forum post
#[post("/forum/general/create")]
pub async fn create_post(db: Data<Database>, request: Json<PostRequestRequest>) -> HttpResponse {
	// Validate the request
	match request.validate() {
		Ok(_) => (),
		Err(err) => {
			return HttpResponse::BadRequest().body(err.to_string());
		}
	}

	// Create the forum post
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

// Create a comment on a forum post
#[post("/forum/general/post/{id}/comment")]
pub async fn post_comment(
	db: Data<Database>,
	id: web::Path<String>,
	request: Json<CommentRequestRequest>
) -> HttpResponse {
	// Validate the request
	match request.validate() {
		Ok(_) => (),
		Err(err) => {
			return HttpResponse::BadRequest().body(err.to_string());
		}
	}

	// Get the forum post by id
	match db.get_forum_post_by_id(id.to_string()).await {
		Ok(Some(mut post)) => {
			// Create the comment
			let comment = Comment::try_from(CommentRequest {
				id: ObjectId::new().to_string(),
				author: request.author.clone(),
				email: request.email.clone(),
				date_created: request.date_created.clone(),
				body: request.body.clone(),
			}).expect("Error converting CommentRequest to Comment.");

			// Convert the comment to BSON
			match comment.to_bson() {
				Ok(document) => {
					// Push the comment to the post
					post.comments.push(mongodb::bson::Bson::Document(document));
					db.update_forum_post(id.to_string(), &post).await.expect("Error updating forum post.");
					HttpResponse::Ok().json(post)
				}
				Err(err) => {
					// Return an internal server error
					return HttpResponse::InternalServerError().body(err.to_string());
				}
			}
		}
		Ok(None) => HttpResponse::NotFound().body("Forum post not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}

// Get the comments by post id
#[post("/forum/general/post/{id}/comments")]
pub async fn get_comments_by_post_id(
	db: Data<Database>,
	id: web::Path<String>,
	request: Json<PaginationArgs>
) -> HttpResponse {
	// Get the pagination arguments
	let PaginationArgs { page, limit, search, field } = request.into_inner();

	// Get the forum post by id
	match db.get_forum_post_by_id(id.to_string()).await {
		Ok(Some(post)) => {
			let skip = (page - 1) * limit;

			// Get the comments
			let comments: Vec<CommentRequest> = post.comments
				.into_iter()
				.rev()
				.skip(skip as usize)
				.take(limit as usize)
				.map(|comment| {
					let id = comment
						.as_document()
						.and_then(|doc| doc.get("_id"))
						.and_then(Bson::as_object_id)
						.unwrap_or(ObjectId::new())
						.to_string();
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
						.unwrap_or_else(|| DateTime::now().to_string());
					let body = comment
						.as_document()
						.and_then(|doc| doc.get("body"))
						.and_then(Bson::as_str)
						.unwrap_or("")
						.to_string();
					CommentRequest {
						id,
						author,
						email,
						date_created,
						body,
					}
				})
				// Filter the comments
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

// A user deletes their own post
#[delete("/forum/general/delete/{id}")]
pub async fn delete_post_as_user(
	db: web::Data<Database>,
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
	let claims = decode::<UserClaims>(
		token,
		&DecodingKey::from_secret(var("SECRET").unwrap().as_ref()),
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

	// Get the forum post by id
	match db.get_forum_post_by_id(id.to_string()).await {
		Ok(Some(post)) => {
			// Check if the user is the author
			if post.author != claims.username {
				return HttpResponse::Unauthorized().body("You are not authorized to delete this post.");
			}

			// Delete the post
			match db.delete_forum_post(id.to_string()).await {
				Ok(_) => HttpResponse::Ok().body("Post deleted successfully."),
				Err(_) => HttpResponse::InternalServerError().body("Failed to delete post."),
			}
		}
		Ok(None) => HttpResponse::NotFound().body("Forum post not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}

// An admin deletes a post
#[delete("/forum/general/delete/as_admin/{id}")]
pub async fn delete_post_as_admin(
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
		&DecodingKey::from_secret(var("SECRET").unwrap().as_ref()),
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

	// Delete the post
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

// A user deletes their own comment
#[delete("/forum/general/delete/{post_id}/comments/{comment_id}")]
pub async fn delete_comment(
	db: web::Data<Database>,
	path: web::Path<(String, String)>,
	req: HttpRequest
) -> HttpResponse {
	// Get the post id and comment id
	let (post_id, comment_id) = path.into_inner();

	// Get the token
	let token = match req.headers().get("Authorization") {
		Some(header_value) => header_value.to_str().unwrap_or(""),
		None => {
			return HttpResponse::Unauthorized().body("Missing token");
		}
	};

	// Decode the JWT
	let claims = decode::<UserClaims>(
		token,
		&DecodingKey::from_secret(var("SECRET").unwrap().as_ref()),
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

	// Get the comment by id
	match db.get_comment_by_id(post_id.to_string(), comment_id.to_string()).await {
		Ok(Some(comment)) => {
			// Check if the user is the author
			if comment.as_document().unwrap().get("author").unwrap().as_str().unwrap() != claims.username {
				return HttpResponse::Unauthorized().body("You are not authorized to delete this comment.");
			}

			// Delete the comment
			match db.delete_comment(post_id.to_string(), comment_id.to_string()).await {
				Ok(_) => HttpResponse::Ok().body("Comment deleted successfully."),
				Err(_) => HttpResponse::InternalServerError().body("Failed to delete comment."),
			}
		}
		Ok(None) => HttpResponse::NotFound().body("Comment not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}

// An admin deletes a comment
#[delete("/forum/general/delete/as_admin/{post_id}/comments/{comment_id}")]
pub async fn delete_comment_as_admin(
	db: web::Data<Database>,
	path: web::Path<(String, String)>,
	req: HttpRequest
) -> HttpResponse {
	// Get the post id and comment id
	let (post_id, comment_id) = path.into_inner();

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
		&DecodingKey::from_secret(var("SECRET").unwrap().as_ref()),
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

	// Delete the comment
	match db.get_comment_by_id(post_id.to_string(), comment_id.to_string()).await {
		Ok(Some(_)) => {
			match db.delete_comment(post_id.to_string(), comment_id.to_string()).await {
				Ok(_) => HttpResponse::Ok().body("Comment deleted successfully."),
				Err(_) => HttpResponse::InternalServerError().body("Failed to delete comment."),
			}
		}
		Ok(None) => HttpResponse::NotFound().body("Comment post not found."),
		Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
	}
}
