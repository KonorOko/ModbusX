import { useTabs } from "@/hooks/useTabs";
import { ModbusAddress } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { error } from "@tauri-apps/plugin-log";

export function useModbusPooling(tabId: number) {
  const setValues = useTabs((state) => state.setValues);
  const tab = useTabs((state) => state.tabs[tabId]);
  const setTabError = useTabs((state) => state.setTabError);

  const count = tab?.modbusConfig?.count || 0;
  const startAddress = tab?.modbusConfig?.startAddress || 0;
  const intervalMs = tab?.polling?.intervalMs || 0;
  const isActive = tab?.polling?.isActive || false;
  const slaveId = tab?.modbusConfig?.slaveId || 1;
  const registerType = tab?.modbusConfig?.registerType || "holding";

  useEffect(() => {
    if (!isActive || !intervalMs || intervalMs <= 0) return;
    const fetchData = async () => {
      try {
        let command;

        if (registerType === "holding") {
          command = "read_holding_registers";
        } else if (registerType === "input") {
          command = "read_input_registers";
        } else if (registerType === "coil") {
          command = "read_coils";
        } else if (registerType === "discrete") {
          command = "read_discrete_inputs";
        } else {
          throw new Error("Invalid register type");
        }

        const response: ModbusAddress[] = await invoke(command, {
          id: tabId,
          startAddress,
          count,
          slaveId,
        });
        setValues(tabId, response);
      } catch (e) {
        setTabError(tabId, String(e));
        error("Modbus error in tab " + tabId + ": " + e);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, intervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [tabId, isActive, intervalMs, startAddress, count, registerType, slaveId]);

  return null;
}
