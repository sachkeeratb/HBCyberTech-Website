use serde::Deserialize;

// Define the PaginationArgs struct
#[derive(Deserialize)]
pub struct PaginationArgs {
	pub page: u32,
	pub limit: u32,
	pub search: String,
	pub field: String,
}

// Define the AdminPaginationArgs struct
#[derive(Deserialize)]
pub struct AdminPaginationArgs {
	pub token: String,
	pub page: u32,
	pub limit: u32,
	pub search: String,
	pub field: String,
}
