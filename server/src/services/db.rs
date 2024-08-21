use std::env;

use mongodb::{bson::doc, error::Error, results::InsertOneResult, Collection};

use crate::models::general_member::GeneralMember;

extern crate dotenv;

pub struct Database {
  general_member: Collection<GeneralMember>
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

    Database {
      general_member
    }
  }

  pub async fn does_exist_full_name(&self, full_name: String) -> bool {
    let existing_member = self.general_member.find_one(doc! { "full_name": &full_name }).await.ok();
    if let Some(existing_member) = existing_member {
      return existing_member.is_some();
    }
    false
  }

  pub async fn does_exist_email(&self, email: String) -> bool {
    let existing_member = self.general_member.find_one(doc! { "email": &email }).await.ok();
    if let Some(existing_member) = existing_member {
      return existing_member.is_some();
    }
    false
  }

  pub async fn does_exist(&self, general_member: &GeneralMember) -> bool {
    let existing_member = self.general_member.find_one(
      doc! { "$or": [{ "full_name": &general_member.full_name }, { "email": &general_member.email }] }
    ).await.ok();
    if let Some(existing_member) = existing_member {
      return existing_member.is_some();
    }
    false
  }

  pub async fn create_general_member(&self, general_member: GeneralMember) -> Result<InsertOneResult, Error> {
    if self.does_exist(&general_member).await {
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
}