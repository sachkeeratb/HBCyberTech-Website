mod models;
mod routes;
mod services;
mod utilities;

use std::env::var;
use actix_cors::Cors;
use actix_web::{ web::Data, App, HttpServer };
use routes::{
	account::{
		account_sign_in,
		create_account,
		get_account_by_username_or_email,
		get_all_accounts,
		verify_account,
	},
	admin::{ admin_sign_in, verify_admin },
	announcement::{
		create_announcement,
		delete_announcement,
		return_amount_of_announcements,
		return_announcements,
	},
	executive_member::{
		create_executive_member,
		get_all_executive_members,
		get_executive_member_by_full_name_or_email,
	},
	forum_post::{
		create_post,
		delete_comment,
		delete_comment_as_admin,
		delete_post_as_admin,
		delete_post_as_user,
		get_comments_by_post_id,
		get_post_by_id,
		post_comment,
		return_amount_of_posts,
		return_posts,
	},
	general_member::{
		create_general_member,
		get_all_general_members,
		get_general_member_by_full_name_or_email,
	},
};
use services::db::Database;

#[macro_use]
extern crate validator_derive;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
	// Initialize the database
	let db = Database::init().await;
	let db_data = Data::new(db);

	// Start the server
	HttpServer::new(move || {
		// Enable CORS
		let cors = Cors::default()
			.allow_any_origin()
			.allowed_methods(vec!["GET", "POST", "DELETE"])
			.allow_any_header()
			.max_age(3600)
			.send_wildcard();

		// Create the app with all of the services created in the routes module
		App::new()
			.wrap(cors)
			.app_data(db_data.clone())
			.service(create_general_member)
			.service(get_general_member_by_full_name_or_email)
			.service(get_all_general_members)
			.service(create_executive_member)
			.service(get_executive_member_by_full_name_or_email)
			.service(get_all_executive_members)
			.service(create_announcement)
			.service(delete_announcement)
			.service(return_announcements)
			.service(return_amount_of_announcements)
			.service(get_account_by_username_or_email)
			.service(create_post)
			.service(delete_post_as_user)
			.service(delete_post_as_admin)
			.service(return_posts)
			.service(get_post_by_id)
			.service(return_amount_of_posts)
			.service(get_comments_by_post_id)
			.service(post_comment)
			.service(delete_comment)
			.service(delete_comment_as_admin)
			.service(create_account)
			.service(account_sign_in)
			.service(verify_account)
			.service(get_all_accounts)
			.service(admin_sign_in)
			.service(verify_admin)
	})
		// Bind the server to the host and port
		.bind((
			var("HOST").unwrap_or_else(|_| "localhost".to_string()),
			var("PORT")
				.unwrap_or_else(|_| "8080".to_string())
				.parse::<u16>()
				.unwrap(),
		))?
		// Start the server
		.run().await
}
