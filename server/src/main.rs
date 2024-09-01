mod models;
mod routes;
mod services;
mod utilities;

use actix_cors::Cors;
use routes::{
	account::{account_sign_in, create_account, get_account_by_username_or_email, get_all_accounts, verify_account}, 
	admin::{admin_sign_in, verify_admin}, 
	announcement_forum_post::{return_amount_of_announcements, return_announcements}, 
	executive_member::{create_executive_member, get_all_executive_members, get_executive_member_by_full_name_or_email}, 
	forum_post::{create_post, get_comments_by_post_id, get_post_by_id, post_comment, return_amount_of_posts, return_posts}, 
	general_member::{create_general_member, get_all_general_members, get_general_member_by_full_name_or_email}
};
use services::db::Database;
use actix_web::{web::Data, App, HttpServer};

#[macro_use]
extern crate dotenv_codegen;

#[macro_use]
extern crate validator_derive;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	let db = Database::init().await;
	let db_data = Data::new(db);

	HttpServer::new(move || {	
		let cors = Cors::default()
			.allowed_origin(dotenv!("CLIENT_URL"))
			.allowed_methods(vec!["GET", "POST"])
			.allow_any_header()
			.max_age(3600)
			.send_wildcard();
		App::new()
			.wrap(cors)
			.app_data(db_data.clone())
			.service(create_general_member)
			.service(get_general_member_by_full_name_or_email)
			.service(get_all_general_members)
			.service(create_executive_member)
			.service(get_executive_member_by_full_name_or_email)
			.service(get_all_executive_members)
			.service(return_announcements)
			.service(return_amount_of_announcements)
			.service(get_account_by_username_or_email)
			.service(create_post)
			.service(return_posts)
			.service(get_post_by_id)
			.service(return_amount_of_posts)
			.service(get_comments_by_post_id)
			.service(post_comment)
			.service(create_account)
			.service(account_sign_in)
			.service(verify_account)
			.service(get_all_accounts)
			.service(admin_sign_in)
			.service(verify_admin)
	})
		.bind((dotenv!("HOST"), dotenv!("PORT").parse::<u16>().unwrap()))?
		.run()
		.await
}
