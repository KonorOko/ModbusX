use std::{collections::HashMap, sync::Arc};

use tokio::sync::RwLock;

use crate::modbus::ModbusConnectionTrait;

pub type ConnectionId = u32;

pub struct ModbusConnectionManager {
    connections: RwLock<HashMap<ConnectionId, Arc<dyn ModbusConnectionTrait>>>,
}

impl ModbusConnectionManager {
    pub fn new() -> Self {
        Self {
            connections: RwLock::new(HashMap::new()),
        }
    }
    pub async fn add_connection(
        &self,
        id: ConnectionId,
        connection: Arc<dyn ModbusConnectionTrait>,
    ) {
        self.connections.write().await.insert(id, connection);
    }

    pub async fn remove_connection(&self, id: ConnectionId) {
        self.connections.write().await.remove(&id);
    }

    pub async fn get_connection(&self, id: ConnectionId) -> Option<Arc<dyn ModbusConnectionTrait>> {
        self.connections.read().await.get(&id).cloned()
    }
}
