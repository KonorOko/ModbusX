import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionLayout } from "@/layouts/connection-layout";
import { ModbusRTUForm } from "@/windows/add-connection/components/modbus-rtu-form";
import { ModbusTCPForm } from "@/windows/add-connection/components/modbus-tcp-form";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { error } from "@tauri-apps/plugin-log";
import { ModbusFormValues } from "./types";

export function AddConnectionPage() {
  const handleConnection = async (values: ModbusFormValues) => {
    const webview = getCurrentWebviewWindow();
    try {
      await webview.emit("add-tab", { values });
    } catch (e) {
      error("Error adding tab: " + e);
    }
    await webview.close();
  };

  return (
    <ConnectionLayout>
      <Tabs defaultValue="tcp" className="h-full w-full">
        <TabsList
          className="bg-background h-10 w-full rounded-b-none border pt-0 pr-0 pb-0 *:min-w-32"
          data-tauri-drag-region
        >
          <TabsTrigger
            value="tcp"
            className="data-[state=active]:bg-muted border-muted ml-24 rounded-none border-b-0 border-l"
          >
            TCP
          </TabsTrigger>
          <TabsTrigger
            value="rtu"
            className="data-[state=active]:bg-muted rounded-none border-b-0"
          >
            RTU
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tcp" className="max-h-screen overflow-y-scroll">
          <ModbusTCPForm onTCPSubmit={handleConnection} />
        </TabsContent>
        <TabsContent value="rtu" className="max-h-screen overflow-y-scroll">
          <ModbusRTUForm onRTUSubmit={handleConnection} />
        </TabsContent>
      </Tabs>
    </ConnectionLayout>
  );
}

export default AddConnectionPage;
