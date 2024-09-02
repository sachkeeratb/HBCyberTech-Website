use futures_util::TryStreamExt;
use mongodb::{
	bson::{ doc, oid::ObjectId, DateTime, Uuid },
	error::Error,
	results::{ DeleteResult, InsertOneResult, UpdateResult },
	Collection,
};
use passwords::{ analyzer, scorer, PasswordGenerator };
use rand::Rng;
use std::env;

use crate::models::{
	account::Account,
	admin::Admin,
	announcement::Announcement,
	executive_member::ExecutiveMember,
	forum_post::Post,
	general_member::GeneralMember,
};

pub struct Database {
	general_member: Collection<GeneralMember>,
	executive_member: Collection<ExecutiveMember>,
	announcement: Collection<Announcement>,
	forum_post: Collection<Post>,
	account: Collection<Account>,
	admin: Collection<Admin>,
}

impl Database {
	pub async fn init() -> Self {
		dotenv::dotenv().expect("Failed to read .env file");
		let uri = match env::var("MONGO_URI") {
			Ok(val) => val.to_string(),
			Err(_) => "mongodb://localhost:27017/?directConnection=true".to_string(),
		};

		let client = mongodb::Client::with_uri_str(&uri).await.unwrap();
		let db = client.database("cybertechdb");

		let general_member: Collection<GeneralMember> = db.collection("GeneralMemberForms");
		let executive_member: Collection<ExecutiveMember> = db.collection("ExecutiveMemberForms");
		let announcement: Collection<Announcement> = db.collection("Announcements");
		let forum_post: Collection<Post> = db.collection("ForumPosts");
		let account: Collection<Account> = db.collection("Accounts");
		let admin: Collection<Admin> = db.collection("Admin");

		Database {
			general_member,
			executive_member,
			announcement,
			forum_post,
			account,
			admin,
		}
	}

	pub async fn gen_mem_does_exist_full_name(&self, full_name: String) -> bool {
		let existing_member = self.general_member.find_one(doc! { "full_name": &full_name }).await.ok();
		if let Some(existing_member) = existing_member {
			return existing_member.is_some();
		}
		false
	}
	pub async fn gen_mem_does_exist_email(&self, email: String) -> bool {
		let existing_member = self.general_member.find_one(doc! { "email": &email }).await.ok();
		if let Some(existing_member) = existing_member {
			return existing_member.is_some();
		}
		false
	}
	pub async fn gen_mem_does_exist(&self, general_member: &GeneralMember) -> bool {
		let existing_member = self.general_member
			.find_one(
				doc! { "$or": [{ "full_name": &general_member.full_name }, { "email": &general_member.email }] }
			).await
			.ok();
		if let Some(existing_member) = existing_member {
			return existing_member.is_some();
		}
		false
	}

	pub async fn create_general_member(
		&self,
		general_member: GeneralMember
	) -> Result<InsertOneResult, Error> {
		if self.gen_mem_does_exist(&general_member).await {
			return Err(
				Error::from(
					std::io::Error::new(std::io::ErrorKind::AlreadyExists, "Member already exists.")
				)
			);
		}

		let result = self.general_member
			.insert_one(general_member).await
			.ok()
			.expect("Error creating general member.");

		Ok(result)
	}
	pub async fn get_all_general_members(
		&self,
		page: u32,
		limit: u32,
		search: String,
		field: String
	) -> Result<Vec<GeneralMember>, Error> {
		let skip = (page - 1) * limit;
		let filter = if search.is_empty() {
			doc! {}
		} else if field == "grade".to_owned() {
			let num = search.parse::<i32>().unwrap_or(9);
			doc! { "grade": { "$regex": num, "$options": "i" } }
		} else {
			doc! { field : { "$regex": search, "$options": "i" } }
		};
		let cursor = self.general_member.find(filter).skip(skip.into()).limit(limit.into()).await?;
		let members = cursor.try_collect().await?;
		Ok(members)
	}

	pub async fn exec_mem_does_exist_full_name(&self, full_name: String) -> bool {
		let existing_member = self.executive_member
			.find_one(doc! { "full_name": &full_name }).await
			.ok();
		if let Some(existing_member) = existing_member {
			return existing_member.is_some();
		}
		false
	}
	pub async fn exec_mem_does_exist_email(&self, email: String) -> bool {
		let existing_member = self.executive_member.find_one(doc! { "email": &email }).await.ok();
		if let Some(existing_member) = existing_member {
			return existing_member.is_some();
		}
		false
	}
	pub async fn exec_mem_does_exist(&self, executive_member: &ExecutiveMember) -> bool {
		let existing_member = self.executive_member
			.find_one(
				doc! { "$or": [{ "full_name": &executive_member.full_name }, { "email": &executive_member.email }] }
			).await
			.ok();
		if let Some(existing_member) = existing_member {
			return existing_member.is_some();
		}
		false
	}

	pub async fn create_executive_member(
		&self,
		executive_member: ExecutiveMember
	) -> Result<InsertOneResult, Error> {
		if self.exec_mem_does_exist(&executive_member).await {
			return Err(
				Error::from(
					std::io::Error::new(std::io::ErrorKind::AlreadyExists, "Member already exists.")
				)
			);
		}

		let result = self.executive_member
			.insert_one(executive_member).await
			.ok()
			.expect("Error creating executive member.");

		Ok(result)
	}
	pub async fn get_all_executive_members(
		&self,
		page: u32,
		limit: u32,
		search: String,
		field: String
	) -> Result<Vec<ExecutiveMember>, Error> {
		let skip = (page - 1) * limit;
		let filter = if field == "marketing" || field == "events" || field == "development" {
			doc! { "exec_type": field }
		} else if search.is_empty() {
			doc! {}
		} else if field == "grade".to_owned() {
			let num = search.parse::<i32>().unwrap_or(9);
			doc! { "grade": { "$regex": num, "$options": "i" } }
		} else {
			doc! { field : { "$regex": search, "$options": "i" } }
		};
		let cursor = self.executive_member.find(filter).skip(skip.into()).limit(limit.into()).await?;
		let members = cursor.try_collect().await?;
		Ok(members)
	}

	pub async fn get_announcements(
		&self,
		page: u32,
		limit: u32,
		search: String,
		field: String
	) -> Result<Vec<Announcement>, Error> {
		let skip = (page - 1) * limit;
		let filter = if search.is_empty() {
			doc! {}
		} else {
			doc! { field : { "$regex": search, "$options": "i" } }
		};
		let cursor = self.announcement.find(filter).skip(skip.into()).limit(limit.into()).await?;
		let posts: Vec<Announcement> = cursor.try_collect().await?;
		Ok(posts)
	}
	pub async fn get_amount_of_announcements(&self) -> Result<u64, Error> {
		let amount = self.announcement.count_documents(doc! {}).await?;
		Ok(amount)
	}
	pub async fn get_announcement_by_id(&self, id: String) -> Result<Option<Announcement>, Error> {
		let object_id = ObjectId::parse_str(&id).expect("Error parsing ID.");
		let post = self.announcement.find_one(doc! { "_id": object_id }).await?;
		Ok(post)
	}

	pub async fn create_announcement(
		&self,
		announcement: Announcement
	) -> Result<InsertOneResult, Error> {
		let result = self.announcement
			.insert_one(announcement).await
			.ok()
			.expect("Error creating announcement.");

		Ok(result)
	}
	pub async fn delete_announcement(&self, id: String) -> Result<DeleteResult, Error> {
		let object_id = ObjectId::parse_str(&id).expect("Error parsing ID.");
		let result = self.announcement
			.delete_one(doc! { "_id": object_id }).await
			.ok()
			.expect("Error deleting announcement.");

		Ok(result)
	}

	pub async fn get_forum_posts(
		&self,
		page: u32,
		limit: u32,
		search: String,
		field: String
	) -> Result<Vec<Post>, Error> {
		let skip = (page - 1) * limit;
		let filter = if search.is_empty() {
			doc! {}
		} else {
			doc! { field : { "$regex": search, "$options": "i" } }
		};
		let cursor = self.forum_post.find(filter).skip(skip.into()).limit(limit.into()).await?;
		let posts: Vec<Post> = cursor.try_collect().await?;
		Ok(posts)
	}
	pub async fn get_amount_of_forum_posts(&self) -> Result<u64, Error> {
		let amount = self.forum_post.count_documents(doc! {}).await?;
		Ok(amount)
	}
	pub async fn get_forum_post_by_id(&self, id: String) -> Result<Option<Post>, Error> {
		let object_id = ObjectId::parse_str(&id).expect("Error parsing ID.");
		let post = self.forum_post.find_one(doc! { "_id": object_id }).await?;
		Ok(post)
	}

	pub async fn create_forum_post(&self, post: Post) -> Result<InsertOneResult, Error> {
		let result = self.forum_post.insert_one(post).await.ok().expect("Error creating forum post.");

		Ok(result)
	}
	pub async fn update_forum_post(&self, id: String, post: &Post) -> Result<UpdateResult, Error> {
		let object_id = ObjectId::parse_str(&id).expect("Error parsing ID.");
		let result = self.forum_post
			.update_one(
				doc! { "_id": object_id },
				doc! { "$set": { "comments": post.comments.clone() } }
			).await
			.ok()
			.expect("Error updating forum post.");

		Ok(result)
	}
	pub async fn delete_forum_post(&self, id: String) -> Result<DeleteResult, Error> {
		let object_id = ObjectId::parse_str(&id).expect("Error parsing ID.");
		let result = self.forum_post
			.delete_one(doc! { "_id": object_id }).await
			.ok()
			.expect("Error deleting forum post.");

		Ok(result)
	}

	pub async fn account_does_exist_full_name(&self, username: String) -> bool {
		let acc = self.account.find_one(doc! { "username": &username }).await.ok();
		if let Some(acc) = acc {
			return acc.is_some();
		}
		false
	}
	pub async fn account_does_exist_email(&self, email: String) -> bool {
		let acc = self.account.find_one(doc! { "email": &email }).await.ok();
		if let Some(acc) = acc {
			return acc.is_some();
		}
		false
	}
	pub async fn account_does_exist(&self, acc: &Account) -> bool {
		let acc = self.account
			.find_one(doc! { "$or": [{ "username": &acc.username }, { "email": &acc.email }] }).await
			.ok();
		if let Some(acc) = acc {
			return acc.is_some();
		}
		false
	}

	pub async fn get_account_password_by_email(
		&self,
		email: String
	) -> Result<Option<String>, Error> {
		let account = self.account.find_one(doc! { "email": &email }).await?;
		if let Some(account) = account {
			return Ok(Some(account.password));
		}
		Ok(None)
	}
	pub async fn get_account_by_email(&self, email: String) -> Result<Option<Account>, Error> {
		let account = self.account.find_one(doc! { "email": &email }).await?;
		Ok(account)
	}

	pub async fn verify_account(&self, id: String) -> Result<UpdateResult, Error> {
		let object_id = ObjectId::parse_str(&id).expect("Error parsing ID.");
		let result = self.account
			.update_one(doc! { "_id": object_id }, doc! { "$set": { "verified": true } }).await
			.ok()
			.expect("Error verifying account.");

		Ok(result)
	}
	pub async fn create_account(&self, acc: Account) -> Result<InsertOneResult, Error> {
		if self.account_does_exist(&acc).await {
			return Err(
				Error::from(
					std::io::Error::new(std::io::ErrorKind::AlreadyExists, "Account already exists.")
				)
			);
		}

		let result = self.account.insert_one(acc).await.ok().expect("Error creating account.");

		Ok(result)
	}
	pub async fn get_all_accounts(
		&self,
		page: u32,
		limit: u32,
		search: String,
		field: String
	) -> Result<Vec<Account>, Error> {
		let skip = (page - 1) * limit;
		let filter = if field == "verified".to_owned() || field == "unverified".to_owned() {
			let boolean = field == "verified".to_owned();
			doc! { "verified": { "$regex": boolean, "$options": "i" } }
		} else if search.is_empty() {
			doc! {}
		} else {
			doc! { field : { "$regex": search, "$options": "i" } }
		};
		let cursor = self.account.find(filter).skip(skip.into()).limit(limit.into()).await?;
		let members = cursor.try_collect().await?;
		Ok(members)
	}

	pub async fn update_admin(&self) -> Result<UpdateResult, Error> {
		// Generate a number between 30 and 45
		let num = rand::thread_rng().gen_range(30..=45);

		// Create a password generator to generate a secure password with a length between 30 and 45 characters
		let mut pgi = (PasswordGenerator {
			length: num,
			numbers: true,
			lowercase_letters: true,
			uppercase_letters: true,
			symbols: true,
			spaces: true,
			exclude_similar_characters: true,
			strict: true,
		})
			.try_iter()
			.unwrap();

		// Create a new password with a score of at least 90
		let mut new_password = pgi.next().unwrap();
		while scorer::score(&analyzer::analyze(&new_password)) < 90.0 {
			new_password = pgi.next().unwrap();
		}

		let new_token = Uuid::new();

		// Update the admin account with the new password and the current time
		let result = self.admin.update_one(
			doc! {},
			doc! { "$set": { "token": new_token, "password": new_password, "last_reset": DateTime::now() } }
		).await?;

		// Return the result of the update operation
		Ok(result)
	}

	pub async fn get_admin(&self) -> Result<Admin, Error> {
		// Get the admin account
		let admin = self.admin
			.find_one(doc! {}).await
			.expect("Admin does not exist.")
			.unwrap();

		return Ok(admin);
	}
}
