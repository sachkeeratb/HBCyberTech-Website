use std::env;

use mongodb::{error::Error, results::InsertOneResult, Collection};

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

  pub async fn create_general_member(&self, general_member: GeneralMember) -> Result<InsertOneResult, Error> {
    let result = self
      .general_member
      .insert_one(general_member)
      .await
      .ok()
      .expect("Error creating general member.");

    Ok(result)
  }
}