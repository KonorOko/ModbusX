type RegisterType = "coil" | "discrete" | "holding" | "input";
type DisplayFormat = "decimal" | "hex" | "binary" | "float" | "int32" | "ascii";

interface ModbusConfig {
  startAddress: number;
  count: number;
  registerType: RegisterType;
  displayFormat: DisplayFormat;
  path: string;
  slaveId: number;
}

interface PollingState {
  intervalMs: number;
  isActive: boolean;
}

export type ModbusAddress = {
  address: number;
  value: number;
};

export interface TabState {
  tabId: number;
  modbusConfig: ModbusConfig;

  values: ModbusAddress[];

  polling: PollingState;

  error: string | null;
}
