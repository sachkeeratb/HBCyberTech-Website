use serde::{ Deserialize, Serialize };
use mongodb::bson::oid::ObjectId;

#[derive(Serialize, Deserialize)]
pub struct Resource {
	pub _id: ObjectId,
	pub title: String,
	pub link: String,
	pub tags: Vec<String>,
	pub description: String,
}

#[derive(Serialize, Deserialize)]
pub struct ResourceRequest {
	pub title: String,
	pub link: String,
	pub tags: Vec<String>,
	pub description: String,
}

// Implement the TryFrom trait for ResourceRequest
impl TryFrom<ResourceRequest> for Resource {
	type Error = Box<dyn std::error::Error>;

	fn try_from(item: ResourceRequest) -> Result<Self, Self::Error> {
		Ok(Self {
			_id: ObjectId::new(),
			title: item.title,
			link: item.link,
			tags: item.tags,
			description: item.description,
		})
	}
}
