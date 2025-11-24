use std::sync::Arc;

use crate::{
    app_state::registry::AppState,
    modbus::{
        connection::{ModbusConnectionRTU, ModbusConnectionSettings, ModbusConnectionTCP},
        ModbusConnectionTrait,
    },
};
use log::info;
use rodbus::{DataBits, Indexed, Parity, StopBits};
use serde::Serialize;
use tauri::State;

#[tauri::command]
pub async fn close_connection(app_state: State<'_, AppState>, id: u32) -> Result<(), String> {
    app_state.connection_manager().remove_connection(id).await;

    Ok(())
}

// Modbus RTU Controller
#[tauri::command]
pub async fn connect_modbus_rtu(
    app_state: State<'_, AppState>,
    id: u32,
    path: String,
    baud_rate: u32,
    data_bits: u8,
    parity: String,
    stop_bits: u8,
    retries: u32,
) -> Result<(), String> {
    info!("Connecting to Modbus RTU device at {}", path);

    let mut connection = ModbusConnectionRTU::new();

    let data_bits = match data_bits {
        5 => DataBits::Five,
        6 => DataBits::Six,
        7 => DataBits::Seven,
        8 => DataBits::Eight,
        _ => return Err("Invalid data bits".to_string()),
    };

    let parity = match parity.as_str() {
        "none" => Parity::None,
        "even" => Parity::Even,
        "odd" => Parity::Odd,
        _ => return Err("Invalid parity".to_string()),
    };

    let stop_bits = match stop_bits {
        1 => StopBits::One,
        2 => StopBits::Two,
        _ => return Err("Invalid stop bits".to_string()),
    };

    let settings = ModbusConnectionSettings::RTU {
        path,
        baud_rate,
        data_bits,
        parity,
        stop_bits,
    };
    connection
        .establish_connection(settings)
        .await
        .map_err(|e| e.to_string())?;

    for attempt in 1..=retries {
        match connection.read_coils(1, 1, 1).await {
            Ok(_) => break,
            Err(e) => {
                info!("Attempt {} failed: {}", attempt, e);
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
                if attempt == retries {
                    return Err(e.to_string());
                }
            }
        }
    }

    app_state
        .connection_manager()
        .add_connection(id, Arc::new(connection))
        .await;

    Ok(())
}

// Modbus TCP Controller
#[tauri::command]
pub async fn connect_modbus_tcp(
    app_state: State<'_, AppState>,
    id: u32,
    host: String,
    port: u16,
    retries: u32,
) -> Result<(), String> {
    info!("Connecting to Modbus TCP address: {}:{}", host, port);
    let mut connection = ModbusConnectionTCP::new();
    let settings = ModbusConnectionSettings::TCP { host, port };

    connection
        .establish_connection(settings)
        .await
        .map_err(|e| e.to_string())?;

    for attempt in 1..=retries {
        match connection.read_coils(1, 1, 1).await {
            Ok(_) => break,
            Err(e) => {
                info!("Attempt {} failed: {}", attempt, e);
                tokio::time::sleep(std::time::Duration::from_secs(1)).await;
                if attempt == retries {
                    return Err(e.to_string());
                }
            }
        }
    }

    app_state
        .connection_manager()
        .add_connection(id, Arc::new(connection))
        .await;

    Ok(())
}

// Read Data Commands
#[tauri::command]
pub async fn read_coils(
    app_state: State<'_, AppState>,
    id: u32,
    start_address: u16,
    count: u16,
    slave_id: u8,
) -> Result<Vec<IndexedValue>, String> {
    info!("Reading coils from Modbus");
    let connection = app_state
        .connection_manager()
        .get_connection(id)
        .await
        .ok_or("Connection not found")?;
    let result = connection
        .read_coils(slave_id, start_address, count)
        .await
        .map_err(|e| e.to_string())?;

    Ok(result
        .into_iter()
        .map(|indexed| IndexedValue::from(indexed))
        .collect())
}

#[tauri::command]
pub async fn read_holding_registers(
    app_state: State<'_, AppState>,
    id: u32,
    start_address: u16,
    count: u16,
    slave_id: u8,
) -> Result<Vec<IndexedValue>, String> {
    info!("Reading holding registers from Modbus");
    let connection = app_state
        .connection_manager()
        .get_connection(id)
        .await
        .ok_or("Connection not found")?;
    let result = connection
        .read_holding_registers(slave_id, start_address, count)
        .await
        .map_err(|e| e.to_string())?;

    Ok(result
        .into_iter()
        .map(|indexed| IndexedValue::from(indexed))
        .collect())
}

#[tauri::command]
pub async fn read_input_registers(
    app_state: State<'_, AppState>,
    id: u32,
    start_address: u16,
    count: u16,
    slave_id: u8,
) -> Result<Vec<IndexedValue>, String> {
    info!("Reading input registers from Modbus");
    let connection = app_state
        .connection_manager()
        .get_connection(id)
        .await
        .ok_or("Connection not found")?;
    let result = connection
        .read_input_registers(slave_id, start_address, count)
        .await
        .map_err(|e| e.to_string())?;

    Ok(result
        .into_iter()
        .map(|indexed| IndexedValue::from(indexed))
        .collect())
}

#[tauri::command]
pub async fn read_discrete_inputs(
    app_state: State<'_, AppState>,
    id: u32,
    start_address: u16,
    count: u16,
    slave_id: u8,
) -> Result<Vec<IndexedValue>, String> {
    info!("Reading discrete inputs from Modbus");
    let connection = app_state
        .connection_manager()
        .get_connection(id)
        .await
        .ok_or("Connection not found")?;
    let result = connection
        .read_discrete_inputs(slave_id, start_address, count)
        .await
        .map_err(|e| e.to_string())?;

    Ok(result
        .into_iter()
        .map(|indexed| IndexedValue::from(indexed))
        .collect())
}

// Write Data Commands
#[tauri::command]
pub async fn write_single_coil(
    app_state: State<'_, AppState>,
    id: u32,
    address: u16,
    value: bool,
    slave_id: u8,
) -> Result<IndexedValue, String> {
    info!("Writing single coil to Modbus");
    let value = Indexed::new(address, value);

    let connection = app_state
        .connection_manager()
        .get_connection(id)
        .await
        .ok_or("Connection not found")?;
    let result = connection
        .write_single_coil(slave_id, value)
        .await
        .map_err(|e| e.to_string())?;

    Ok(IndexedValue::from(result))
}

#[tauri::command]
pub async fn write_single_register(
    app_state: State<'_, AppState>,
    id: u32,
    address: u16,
    value: u16,
    slave_id: u8,
) -> Result<IndexedValue, String> {
    info!("Writing single register to Modbus");
    let value = Indexed::new(address, value);

    let connection = app_state
        .connection_manager()
        .get_connection(id)
        .await
        .ok_or("Connection not found")?;
    let result = connection
        .write_single_register(slave_id, value)
        .await
        .map_err(|e| e.to_string())?;

    Ok(IndexedValue::from(result))
}

#[tauri::command]
pub async fn write_multiple_coils(
    app_state: State<'_, AppState>,
    id: u32,
    start_address: u16,
    values: Vec<bool>,
    slave_id: u8,
) -> Result<(), String> {
    info!("Writing multiple coils to Modbus");
    let connection = app_state
        .connection_manager()
        .get_connection(id)
        .await
        .ok_or("Connection not found")?;
    connection
        .write_multiple_coils(slave_id, start_address, values)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn write_multiple_registers(
    app_state: State<'_, AppState>,
    id: u32,
    address: u16,
    values: Vec<u16>,
    slave_id: u8,
) -> Result<(), String> {
    info!("Writing multiple registers to Modbus");
    let connection = app_state
        .connection_manager()
        .get_connection(id)
        .await
        .ok_or("Connection not found")?;
    connection
        .write_multiple_registers(slave_id, address, values)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}

// IndexedValue

#[derive(Serialize)]
pub struct IndexedValue {
    pub address: u16,
    pub value: u16,
}

impl From<Indexed<u16>> for IndexedValue {
    fn from(indexed: Indexed<u16>) -> Self {
        IndexedValue {
            address: indexed.index,
            value: indexed.value,
        }
    }
}

impl From<Indexed<bool>> for IndexedValue {
    fn from(indexed: Indexed<bool>) -> Self {
        IndexedValue {
            address: indexed.index,
            value: indexed.value as u16,
        }
    }
}
