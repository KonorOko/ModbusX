import { useModbusPooling } from "@/hooks/useModbusPooling";
import useSettings from "@/hooks/useSettings";
import { useTabs } from "@/hooks/useTabs";
import { ModbusGrid } from "./modbus-grid";
import { ModbusTable } from "./modbus-table";

export function DataViewContent({ tabId }: { tabId: number }) {
  const { addressLayout } = useSettings((state) => state.settings);
  const modbusConfig = useTabs((state) => state.tabs[tabId].modbusConfig);

  const readOnly =
    modbusConfig.registerType === "discrete" ||
    modbusConfig.registerType === "input"
      ? true
      : false;

  useModbusPooling(tabId);
  return (
    <div className="p-4">
      {addressLayout === "grid" && (
        <ModbusGrid tabId={tabId} readOnly={readOnly} />
      )}
      {addressLayout === "table" && (
        <ModbusTable tabId={tabId} readOnly={readOnly} />
      )}
    </div>
  );
}
