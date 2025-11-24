use crate::errors::{Error, ModbusError, Result};
use rodbus::client::*;
use rodbus::*;
use std::time::Duration;

pub enum ModbusConnectionSettings {
    RTU {
        path: String,
        baud_rate: u32,
        data_bits: DataBits,
        parity: Parity,
        stop_bits: StopBits,
    },
    TCP {
        host: String,
        port: u16,
    },
}

pub trait HasChannel {
    fn channel(&self) -> &Channel;
}

#[async_trait::async_trait]
pub trait ModbusConnectionTrait: Send + Sync + HasChannel {
    async fn establish_connection(
        &mut self,
        connection_settings: ModbusConnectionSettings,
    ) -> Result<()>;

    // Read Methods
    async fn read_coils(
        &self,
        slave_id: u8,
        start_address: u16,
        count: u16,
    ) -> Result<Vec<Indexed<bool>>> {
        let mut channel = self.channel().clone();

        let request_param = RequestParam::new(UnitId::new(slave_id), Duration::from_millis(1000));
        let range = AddressRange {
            start: start_address,
            count,
        };

        let result = channel.read_coils(request_param, range).await?;
        Ok(result)
    }

    async fn read_holding_registers(
        &self,
        slave_id: u8,
        start_address: u16,
        count: u16,
    ) -> Result<Vec<Indexed<u16>>> {
        let mut channel = self.channel().clone();
        let request_param = RequestParam::new(UnitId::new(slave_id), Duration::from_millis(1000));
        let range = AddressRange {
            start: start_address,
            count,
        };

        let result = channel.read_holding_registers(request_param, range).await?;
        Ok(result)
    }

    async fn read_input_registers(
        &self,
        slave_id: u8,
        start_address: u16,
        count: u16,
    ) -> Result<Vec<Indexed<u16>>> {
        let mut channel = self.channel().clone();
        let request_param = RequestParam::new(UnitId::new(slave_id), Duration::from_millis(1000));
        let range = AddressRange {
            start: start_address,
            count,
        };

        let result = channel.read_input_registers(request_param, range).await?;
        Ok(result)
    }

    async fn read_discrete_inputs(
        &self,
        slave_id: u8,
        start_address: u16,
        count: u16,
    ) -> Result<Vec<Indexed<bool>>> {
        let mut channel = self.channel().clone();
        let request_param = RequestParam::new(UnitId::new(slave_id), Duration::from_millis(1000));
        let range = AddressRange {
            start: start_address,
            count,
        };

        let result = channel.read_discrete_inputs(request_param, range).await?;
        Ok(result)
    }

    // Write Methods
    async fn write_single_coil(&self, slave_id: u8, value: Indexed<bool>) -> Result<Indexed<bool>> {
        let mut channel = self.channel().clone();
        let request_param = RequestParam::new(UnitId::new(slave_id), Duration::from_millis(1000));

        let result = channel.write_single_coil(request_param, value).await?;
        Ok(result)
    }

    async fn write_multiple_coils(
        &self,
        slave_id: u8,
        start_address: u16,
        values: Vec<bool>,
    ) -> Result<AddressRange> {
        let mut channel = self.channel().clone();
        let request_param = RequestParam::new(UnitId::new(slave_id), Duration::from_millis(1000));
        let request = WriteMultiple::from(start_address, values)?;

        let result = channel.write_multiple_coils(request_param, request).await?;
        Ok(result)
    }

    async fn write_single_register(
        &self,
        slave_id: u8,
        value: Indexed<u16>,
    ) -> Result<Indexed<u16>> {
        let mut channel = self.channel().clone();
        let request_param = RequestParam::new(UnitId::new(slave_id), Duration::from_millis(1000));

        let result = channel.write_single_register(request_param, value).await?;
        Ok(result)
    }

    async fn write_multiple_registers(
        &self,
        slave_id: u8,
        start_address: u16,
        values: Vec<u16>,
    ) -> Result<AddressRange> {
        let mut channel = self.channel().clone();
        let request_param = RequestParam::new(UnitId::new(slave_id), Duration::from_millis(1000));
        let request = WriteMultiple::from(start_address, values)?;

        let result = channel
            .write_multiple_registers(request_param, request)
            .await?;
        Ok(result)
    }
}

pub struct ModbusConnectionRTU {
    channel: Option<Channel>,
}

impl ModbusConnectionRTU {
    pub fn new() -> Self {
        Self { channel: None }
    }
}

impl HasChannel for ModbusConnectionRTU {
    fn channel(&self) -> &Channel {
        self.channel.as_ref().expect("Connection not established")
    }
}

#[async_trait::async_trait]
impl ModbusConnectionTrait for ModbusConnectionRTU {
    async fn establish_connection(
        &mut self,
        connection_settings: ModbusConnectionSettings,
    ) -> Result<()> {
        match connection_settings {
            ModbusConnectionSettings::RTU {
                path,
                baud_rate,
                data_bits,
                parity,
                stop_bits,
            } => {
                let channel = spawn_rtu_client_task(
                    path.as_str(),
                    rodbus::SerialSettings {
                        baud_rate,
                        data_bits,
                        flow_control: FlowControl::None,
                        parity,
                        stop_bits,
                    },
                    1,
                    default_retry_strategy(),
                    DecodeLevel::default(),
                    None,
                );
                channel.enable().await?;
                self.channel = Some(channel);
                Ok(())
            }
            _ => Err(Error::ModbusError(
                ModbusError::MismatchedConnectionSettings,
            )),
        }
    }
}

pub struct ModbusConnectionTCP {
    channel: Option<Channel>,
}

impl ModbusConnectionTCP {
    pub fn new() -> Self {
        Self { channel: None }
    }
}

impl HasChannel for ModbusConnectionTCP {
    fn channel(&self) -> &Channel {
        self.channel.as_ref().expect("Connection not established")
    }
}

#[async_trait::async_trait]
impl ModbusConnectionTrait for ModbusConnectionTCP {
    async fn establish_connection(
        &mut self,
        connection_settings: ModbusConnectionSettings,
    ) -> Result<()> {
        match connection_settings {
            ModbusConnectionSettings::TCP { host, port } => {
                let channel = spawn_tcp_client_task(
                    HostAddr::ip(host.parse()?, port),
                    1,
                    default_retry_strategy(),
                    DecodeLevel::default(),
                    None,
                );

                channel.enable().await?;
                self.channel = Some(channel);

                Ok(())
            }
            _ => Err(Error::ModbusError(
                ModbusError::MismatchedConnectionSettings,
            )),
        }
    }
}
