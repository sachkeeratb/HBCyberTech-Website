use serde::Deserialize;

#[derive(Deserialize)]
pub struct AdminPaginationArgs {
  pub token: String,
  pub page: u32,
  pub limit: u32,
	pub search: String,
	pub field: String,
}