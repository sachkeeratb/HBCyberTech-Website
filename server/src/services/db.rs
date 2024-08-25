use std::env;

use futures_util::TryStreamExt;
use mongodb::{bson::doc, error::Error, results::InsertOneResult, Collection};

use crate::models::{announcement_forum_post::Announcement, executive_member::ExecutiveMember, general_member::GeneralMember, account::Account};

extern crate dotenv;

pub struct Database {
  general_member: Collection<GeneralMember>,
  executive_member: Collection<ExecutiveMember>,
  announcement_forum_post: Collection<Announcement>,
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
    let account: Collection<Account> = db.collection("Accounts");

    Database {
      general_member,
      executive_member,
      announcement_forum_post,
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


  pub async fn get_announcement_forum_posts(&self) -> Result<Vec<Announcement>, Error> {
    let cursor = self.announcement_forum_post.find(doc! {}).await?;
    let posts: Vec<Announcement> = cursor.try_collect().await?;
    Ok(posts)
  }

  pub async fn get_amount_of_announcement_forum_posts(&self) -> Result<u64, Error> {
    let amount = self.announcement_forum_post.count_documents(doc! {}).await?;
    Ok(amount)
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
    let acc = self.executive_member.find_one(
      doc! { "$or": [{ "username": &acc.username }, { "email": &acc.email }] }
    ).await.ok();
    if let Some(acc) = acc {
      return acc.is_some();
    }
    false
  }

}