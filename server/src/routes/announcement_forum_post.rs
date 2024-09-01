use std::cmp::Reverse;
use actix_web::{get, post, web::{Data, Json}, HttpResponse};
use validator::Validate;
use crate::{models::announcement_forum_post::Announcement, services::db::Database};
use crate::{models::announcement_forum_post::AnnouncementRequest, utilities::pagination_args::PaginationArgs};

#[get("/forum/announcements/get/amount")]
pub async fn return_amount_of_announcements(db: Data<Database>) -> HttpResponse {
	match db.get_amount_of_announcement_forum_posts().await {
		Ok(amount) => HttpResponse::Ok().json(amount),
		Err(_) => HttpResponse::Ok().json(0)
	}
}

#[post("/forum/announcements/get")]
pub async fn return_announcements(db: Data<Database>, request: Json<PaginationArgs>) -> HttpResponse {
	match db.get_announcement_forum_posts(request.page, request.limit, request.search.clone(), request.field.clone()).await {
		Ok(mut posts) => {
			posts.sort_by_key(|post| Reverse(post.date_created));
			let announcements: Vec<AnnouncementRequest> = posts.into_iter().map(|post| {
				AnnouncementRequest {
					author: post.author.clone(),
					email: post.email.clone(),
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

#[post("/forum/announcements/create")]
pub async fn create_announcement_post(db: Data<Database>, request: Json<AnnouncementRequest>) -> HttpResponse {
  match request.validate() {
    Ok(_) => (),
    Err(err) => return HttpResponse::BadRequest().body(err.to_string())
  }
  
  match db
    .create_announcement_forum_post(
      Announcement::try_from(AnnouncementRequest {
        author: "The Team".to_string(),
				email: format!("{}@gmail.com", dotenv!("EMAIL_NAME")),
        date_created: request.date_created.clone(),
        title: request.title.clone(),
        body: request.body.clone()
      })
      .expect("Error converting PostRequest to Post.")
    ).await {
      Ok(post) => HttpResponse::Ok().json(post),
      Err(err) => HttpResponse::InternalServerError().body(err.to_string())
    }
}