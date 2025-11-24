use thiserror::Error;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Error, Debug)]
pub enum Error {
    #[error("Modbus error: {0}")]
    ModbusError(#[from] ModbusError),
}

#[derive(Error, Debug)]
pub enum ModbusError {
    #[error("Connection error: {0}")]
    ConnectionError(#[from] rodbus::Shutdown),

    #[error("Request error: {0}")]
    RequestError(#[from] rodbus::RequestError),

    #[error("Invalid request: {0}")]
    InvalidRequest(#[from] rodbus::InvalidRequest),

    #[error("Error {0}")]
    Error(String),

    #[error("Mismatched connection type")]
    MismatchedConnectionSettings,

    #[error("TCP host error: {0}")]
    TCPHostError(#[from] std::net::AddrParseError),
}

impl From<rodbus::Shutdown> for Error {
    fn from(err: rodbus::Shutdown) -> Self {
        Error::ModbusError(ModbusError::ConnectionError(err))
    }
}

impl From<rodbus::RequestError> for Error {
    fn from(err: rodbus::RequestError) -> Self {
        Error::ModbusError(ModbusError::RequestError(err))
    }
}

impl From<std::net::AddrParseError> for Error {
    fn from(err: std::net::AddrParseError) -> Self {
        Error::ModbusError(ModbusError::TCPHostError(err))
    }
}

impl From<rodbus::InvalidRequest> for Error {
    fn from(err: rodbus::InvalidRequest) -> Self {
        Error::ModbusError(ModbusError::InvalidRequest(err))
    }
}

impl From<String> for Error {
    fn from(err: String) -> Self {
        Error::ModbusError(ModbusError::Error(err))
    }
}
