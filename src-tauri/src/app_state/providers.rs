use crate::app_state::registry::AppState;

pub async fn initialize_app_state() -> Result<AppState, String> {
    Ok(AppState::new())
}
