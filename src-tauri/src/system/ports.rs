#[tauri::command]
pub fn get_ports() -> Result<Vec<String>, String> {
    let ports = serialport::available_ports().map_err(|e| e.to_string())?;
    let ports_names = ports
        .into_iter()
        .map(|port| match port.port_type {
            serialport::SerialPortType::UsbPort(_) => port.port_name,
            _ => "".to_string(),
        })
        .filter(|name| !name.is_empty())
        .collect();

    Ok(ports_names)
}
