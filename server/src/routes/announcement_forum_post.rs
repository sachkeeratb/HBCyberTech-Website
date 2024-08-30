use std::cmp::Reverse;
use actix_web::{get, post, web::{Data, Json}, HttpResponse};
use serde::Deserialize;
use crate::services::db::Database;
use crate::models::announcement_forum_post::AnnouncementRequest;

#[derive(Deserialize)]
struct PaginationArgs {
  page: u32,
  limit: u32,
}

#[get("/forum/announcements/get/amount")]
pub async fn return_amount_of_announcements(db: Data<Database>) -> HttpResponse {
	match db.get_amount_of_announcement_forum_posts().await {
		Ok(amount) => HttpResponse::Ok().json(amount),
		Err(_) => HttpResponse::Ok().json(0)
	}
}

#[post("/forum/announcements/get")]
pub async fn return_announcements(db: Data<Database>, request: Json<PaginationArgs>) -> HttpResponse {
	match db.get_announcement_forum_posts(request.page, request.limit).await {
		Ok(mut posts) => {
			posts.sort_by_key(|post| Reverse(post.date_created));
			let announcements: Vec<AnnouncementRequest> = posts.into_iter().map(|post| {
				AnnouncementRequest {
					author: post.author.clone(),
					date_created: post.date_created.to_string(),
					title: post.title.clone(),
					body: post.body.clone(),
				}
			}).collect();

			HttpResponse::Ok().json(announcements)
		},
		Err(_) => HttpResponse::Ok().json("")
	}
}