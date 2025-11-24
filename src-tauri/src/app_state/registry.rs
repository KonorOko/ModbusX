use std::sync::Arc;

use crate::modbus::connection_manager::ModbusConnectionManager;

pub struct AppState {
    connection_manager: Arc<ModbusConnectionManager>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            connection_manager: Arc::new(ModbusConnectionManager::new()),
        }
    }

    pub fn connection_manager(&self) -> Arc<ModbusConnectionManager> {
        Arc::clone(&self.connection_manager)
    }
}
