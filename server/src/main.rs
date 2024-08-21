mod models;
mod routes;
mod services;

use std::env;

use actix_cors::Cors;
use routes::general_member::{create_general_member, get_general_member_by_full_name_or_email};
use services::db::Database;
use actix_web::{web::Data, App, HttpServer};

extern crate dotenv;

#[macro_use]
extern crate validator_derive;

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
			.service(get_general_member_by_full_name_or_email)
	})
		.bind(("localhost", 8080))?
		.run()
		.await
}
