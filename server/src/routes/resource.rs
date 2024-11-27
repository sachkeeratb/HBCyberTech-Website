use actix_web::{ get, web, HttpResponse };
use crate::Database;
use crate::utilities::pagination_args::ResourcePaginationArgs;
use crate::models::resource::ResourceRequest;

#[get("/resources")]
async fn get_resources(
	db: web::Data<Database>,
	query: web::Query<ResourcePaginationArgs>
) -> HttpResponse {
	let ResourcePaginationArgs { page, limit, search, field, tag } = query.into_inner();
	match db.get_resources(page, limit, search, field, tag).await {
		Ok(resources) => {
			let resources = resources
				.into_iter()
				.map(|resource| {
					ResourceRequest {
						title: resource.title,
						link: resource.link,
						tags: resource.tags,
						description: resource.description,
					}
				})
				.collect::<Vec<ResourceRequest>>();
			HttpResponse::Ok().json(resources)
		}
		Err(_) => HttpResponse::InternalServerError().finish(),
	}
}
