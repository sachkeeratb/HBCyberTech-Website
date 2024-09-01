use std::time::SystemTime;
use chrono::Utc;
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Serialize, Deserialize};
use lazy_static::lazy_static;
use regex::Regex;
use validator::ValidationError;

lazy_static! {
  static ref RE_FULL_NAME: Regex = Regex::new(r"^[A-Za-zÀ-ÖØ-öø-įĴ-őŔ-žǍ-ǰǴ-ǵǸ-țȞ-ȟȤ-ȳɃɆ-ɏḀ-ẞƀ-ƓƗ-ƚƝ-ơƤ-ƥƫ-ưƲ-ƶẠ-ỿ ']{2,40}$").unwrap();
  static ref RE_EMAIL: Regex = Regex::new(r"^[[0-9]{6,7}@pdsb.net$").unwrap();
  static ref RE_EXEC_TYPE: Regex = Regex::new(r"^(development|marketing|events)$").unwrap();
  static ref RE_PORTFOLIO: Regex = Regex::new(r"^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$i").unwrap();
  static ref RE_200: Regex = Regex::new(r"^.{0,200}$").unwrap();
  static ref RE_600: Regex = Regex::new(r"^.{1,600}$").unwrap();
}

fn validate_portfolio(portfolio: &str) -> Result<(), ValidationError> {
  if (portfolio.len() > 0 && RE_PORTFOLIO.is_match(portfolio)) || portfolio.len() == 0 {
    return Ok(());
  } else {
    return Err(ValidationError::new("Invalid portfolio link."));
  }
}


#[derive(Serialize, Deserialize)]
pub struct ExecutiveMember {
  pub _id: ObjectId,
  pub full_name: String,
  pub email: String,
  pub grade: u8,
  pub exec_type: String,
  pub why: String,
  pub experience: String,
  pub portfolio: String,
  pub extra: String,
  pub date_created: DateTime
}	

#[derive(Serialize, Deserialize, Validate)]
pub struct ExecutiveMemberRequest {
  #[validate(regex(
    path = *RE_FULL_NAME,
    message = "Invalid name."
  ))]
  pub full_name: String,
  #[validate(
    regex(
      path = *RE_EMAIL,
      message = "Email must be a valid PDSB email."
    )
  )]
  pub email: String,  
  #[validate(
    range(
      min = 9,
      max = 12,
      message = "Grade should be 9, 10, 11, or 12."
    )
  )]
  pub grade: u8,
  #[validate(
    regex(
      path = *RE_EXEC_TYPE,
      message = "Invalid exec type. Must be development, marketing, or events."
    )
  )] 
  pub exec_type: String,
  #[validate(
    regex(
      path = *RE_600,
      message = "Why should be from 1 to 600 characters."
    )
  )]
  pub why: String,
  #[validate(
    regex(
      path = *RE_600,
      message = "Experience should be from 1 to 600 characters."
    )
  )]
  pub experience: String,
  #[validate(custom(
    function = "validate_portfolio",
    message = "Invalid portfolio link."
  ))]
  pub portfolio: String,
  #[validate(
    regex(
      path = *RE_200,
      message = "Extra information should be from 0 to 200."
    )
  )]
  pub extra: String,
  pub date_created: String
}

impl TryFrom<ExecutiveMemberRequest> for ExecutiveMember {
  type Error = Box<dyn std::error::Error>;

  fn try_from(item: ExecutiveMemberRequest) -> Result<Self, Self::Error> {
    let chrono_datetime: SystemTime = chrono::DateTime::parse_from_rfc3339(&item.date_created)
      .map_err(|err| format!("Error parsing date: {err}"))?
      .with_timezone(&Utc)
      .into();

    Ok(Self {
      _id: ObjectId::new(),
      full_name: item.full_name,
      email: item.email,
      grade: item.grade,
      exec_type: item.exec_type,
      why: item.why,
      experience: item.experience,
      portfolio: item.portfolio,
      extra: item.extra,
      date_created: DateTime::from(chrono_datetime)
    })
  }
}