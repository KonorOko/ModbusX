mod app_state;
mod errors;
mod modbus;
mod system;

use app_state::initialize_app_state;
use log::{error, info};
use modbus::{
    close_connection, connect_modbus_rtu, connect_modbus_tcp, read_coils, read_discrete_inputs,
    read_holding_registers, read_input_registers, write_multiple_coils, write_multiple_registers,
    write_single_coil, write_single_register,
};
use system::get_ports;
use tauri::{AppHandle, LogicalPosition, Manager, Position, TitleBarStyle};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .filter(|metadata| metadata.level() != log::LevelFilter::Trace)
                .build(),
        )
        .setup(move |app| {
            let handle = app.handle().clone();
            tauri::async_runtime::block_on(async {
                info!("Initializing app state...");
                let app_state = match initialize_app_state().await {
                    Ok(app_state) => app_state,
                    Err(err) => {
                        return Err(err);
                    }
                };

                handle.manage(app_state);
                Ok(())
            })
            .map_err(|err| {
                error!("Error initializing app state: {}", err);
                err
            })?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Modbus Connection
            connect_modbus_tcp,
            connect_modbus_rtu,
            close_connection,
            // Read Modbus
            read_coils,
            read_discrete_inputs,
            read_holding_registers,
            read_input_registers,
            // Write Modbus
            write_multiple_coils,
            write_multiple_registers,
            write_single_coil,
            write_single_register,
            // Windows
            create_window,
            // Utils
            get_ports
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn create_window(
    app: AppHandle,
    url: String,
    title: String,
    visible: Option<bool>,
    height: Option<f64>,
    width: Option<f64>,
    maximizable: Option<bool>,
    resizable: Option<bool>,
    traffic_light_position: Option<(f64, f64)>,
) -> Result<(), String> {
    let window_path = tauri::WebviewUrl::App(url.clone().into());
    tauri::WebviewWindowBuilder::new(&app, url, window_path)
        .title(title)
        .hidden_title(true)
        .inner_size(width.unwrap_or(400.0), height.unwrap_or(400.0))
        .maximizable(maximizable.unwrap_or(true))
        .resizable(resizable.unwrap_or(true))
        .visible(visible.unwrap_or(true))
        .title_bar_style(TitleBarStyle::Overlay)
        .traffic_light_position(Position::Logical(LogicalPosition::new(
            traffic_light_position.unwrap_or((20.0, 18.0)).0,
            traffic_light_position.unwrap_or((20.0, 18.0)).1,
        )))
        .center()
        .build()
        .map_err(|e| e.to_string())?;

    Ok(())
}
