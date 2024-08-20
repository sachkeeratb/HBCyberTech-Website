mod models;
mod routes;
mod services;

use std::env;

use actix_cors::Cors;
use routes::general_member::create_general_member;
use services::db::Database;
use actix_web::{web::Data, App, HttpServer};

extern crate dotenv;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	let db = Database::init().await;
	let db_data = Data::new(db);


	HttpServer::new(move || {	
		let cors = Cors::default()
			.allowed_origin(&env::var("CLIENT_URL").unwrap().to_string())
			.allow_any_method()
			.allow_any_header()
			.max_age(3600)
			.send_wildcard();
		App::new()
			.wrap(cors)
			.app_data(db_data.clone())
			.service(create_general_member)
	})
		.bind(("localhost", 8080))?
		.run()
		.await
}
