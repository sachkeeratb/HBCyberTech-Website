mod models;
mod routes;
mod services;

use routes::general_member::create_general_member;
use services::db::Database;
use actix_web::{web::Data, App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	let db = Database::init().await;
	let db_data = Data::new(db);

	HttpServer::new(move || {
		App::new()
			.app_data(db_data.clone())
			.service(create_general_member)
	})
		.bind(("localhost", 8080))?
		.run()
		.await
}
