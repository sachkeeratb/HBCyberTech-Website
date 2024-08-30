use std::env;
use futures_util::TryStreamExt;
use mongodb::{bson::{doc, oid::ObjectId}, error::Error, results::{InsertOneResult, UpdateResult}, Collection};

use crate::models::{account::Account, announcement_forum_post::Announcement, executive_member::ExecutiveMember, forum_post::Post, general_member::GeneralMember};

extern crate dotenv;

pub struct Database {
  general_member: Collection<GeneralMember>,
  executive_member: Collection<ExecutiveMember>,
  announcement_forum_post: Collection<Announcement>,
  forum_post: Collection<Post>,
  account: Collection<Account>
}

impl Database {
  pub async fn init() -> Self {
    dotenv::dotenv().expect("Failed to read .env file");
    let uri = match env::var("MONGO_URI") {
      Ok(val) => val.to_string(),
      Err(_) => "mongodb://localhost:27017/?directConnection=true".to_string()
    };

    let client = mongodb::Client::with_uri_str(&uri).await.unwrap();
    let db = client.database("cybertechdb");

    let general_member: Collection<GeneralMember> = db.collection("GeneralMemberForms");
    let executive_member: Collection<ExecutiveMember> = db.collection("ExecutiveMemberForms");
    let announcement_forum_post: Collection<Announcement> = db.collection("Announcements");
    let forum_post: Collection<Post> = db.collection("ForumPosts");
    let account: Collection<Account> = db.collection("Accounts");

    Database {
      general_member,
      executive_member,
      announcement_forum_post,
      forum_post,
      account
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
    let existing_member = self.general_member.find_one(
      doc! { "$or": [{ "full_name": &general_member.full_name }, { "email": &general_member.email }] }
    ).await.ok();
    if let Some(existing_member) = existing_member {
      return existing_member.is_some();
    }
    false
  }

  pub async fn create_general_member(&self, general_member: GeneralMember) -> Result<InsertOneResult, Error> {
    if self.gen_mem_does_exist(&general_member).await {
      return Err(Error::from(std::io::Error::new(std::io::ErrorKind::AlreadyExists, "Member already exists.")));
    }

    let result = self
      .general_member
      .insert_one(general_member)
      .await
      .ok()
      .expect("Error creating general member.");

    Ok(result)
  }


  pub async fn exec_mem_does_exist_full_name(&self, full_name: String) -> bool {
    let existing_member = self.executive_member.find_one(doc! { "full_name": &full_name }).await.ok();
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
    let existing_member = self.executive_member.find_one(
      doc! { "$or": [{ "full_name": &executive_member.full_name }, { "email": &executive_member.email }] }
    ).await.ok();
    if let Some(existing_member) = existing_member {
      return existing_member.is_some();
    }
    false
  }

  pub async fn create_executive_member(&self, executive_member: ExecutiveMember) -> Result<InsertOneResult, Error> {
    if self.exec_mem_does_exist(&executive_member).await {
      return Err(Error::from(std::io::Error::new(std::io::ErrorKind::AlreadyExists, "Member already exists.")));
    }

    let result = self
      .executive_member
      .insert_one(executive_member)
      .await
      .ok()
      .expect("Error creating executive member.");

    Ok(result)
  }


  pub async fn get_announcement_forum_posts(&self, page: u32, limit: u32) -> Result<Vec<Announcement>, Error> {
    let skip = (page - 1) * limit;
    let cursor = self.announcement_forum_post.find(doc! {}).skip(skip.into()).limit(limit.into()).await?;
    let posts: Vec<Announcement> = cursor.try_collect().await?;
    Ok(posts)
  }
  pub async fn get_amount_of_announcement_forum_posts(&self) -> Result<u64, Error> {
    let amount = self.announcement_forum_post.count_documents(doc! {}).await?;
    Ok(amount)
  }

  
  pub async fn get_forum_posts(&self, page: u32, limit: u32) -> Result<Vec<Post>, Error> {
    let skip = (page - 1) * limit;
    let cursor = self.forum_post.find(doc! {}).skip(skip.into()).limit(limit.into()).await?;
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
    let result = self
      .forum_post
      .insert_one(post)
      .await
      .ok()
      .expect("Error creating forum post.");

    Ok(result)
  }
  pub async fn update_forum_post(&self, id: String, post: &Post) -> Result<UpdateResult, Error> {
    let object_id = ObjectId::parse_str(&id).expect("Error parsing ID.");
    let result = self
      .forum_post
      .update_one(doc! { "_id": object_id }, doc! { "$set": { "comments": post.comments.clone() } })
      .await
      .ok()
      .expect("Error updating forum post.");

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
    let acc = self.account.find_one(
      doc! { "$or": [{ "username": &acc.username }, { "email": &acc.email }] }
    ).await.ok();
    if let Some(acc) = acc {
      return acc.is_some();
    }
    false
  }

  pub async fn get_account_password_by_email(&self, email: String) -> Result<Option<String>, Error> {
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
      let result = self
        .account
        .update_one(doc! { "_id": object_id }, doc! { "$set": { "verified": true } })
        .await
        .ok()
        .expect("Error verifying account.");
  
      Ok(result)
  }
  pub async fn create_account(&self, acc: Account) -> Result<InsertOneResult, Error> {
    if self.account_does_exist(&acc).await {
      return Err(Error::from(std::io::Error::new(std::io::ErrorKind::AlreadyExists, "Account already exists.")));
    }

    let result = self
      .account
      .insert_one(acc)
      .await
      .ok()
      .expect("Error creating account.");

    Ok(result)
  }
}