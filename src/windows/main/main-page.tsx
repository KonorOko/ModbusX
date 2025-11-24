import { useTabs } from "@/hooks/useTabs";
import { MainLayout } from "@/layouts/main-layout";
import { DataView } from "@/windows/main/components/data-view";
import { Header } from "@/windows/main/components/header";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { error } from "@tauri-apps/plugin-log";
import { useEffect } from "react";
import { toast } from "sonner";
import { Payload } from "./types";

function IndexPage() {
  const addTab = useTabs((state) => state.addTab);
  const setActiveTab = useTabs((state) => state.setActiveTab);
  const getTabsCount = useTabs((state) => state.getTabsCount);

  const handleConnection = async (id: number, payload: Payload) => {
    const { type } = payload.values;

    if (type === "TCP") {
      const { port, host, retries } = payload.values;
      await invoke("connect_modbus_tcp", {
        id,
        port,
        host,
        retries,
      });

      return host + ":" + port;
    } else if (type === "RTU") {
      const { path, baudRate, dataBits, parity, stopBits, retries } =
        payload.values;
      await invoke("connect_modbus_rtu", {
        id,
        path,
        baudRate,
        dataBits,
        parity,
        stopBits,
        retries,
      });

      return path;
    }
  };

  useEffect(() => {
    const unlistenAddTab = listen<Payload>("add-tab", (event) => {
      if (!event.payload.values) return;
      const id = getTabsCount() + 1;
      toast.promise(handleConnection(id, event.payload), {
        loading: "Connecting...",
        success: (path: string) => {
          addTab(id, path);
          setActiveTab(id);
          return "Connected!";
        },
        error: (e) => {
          error(e);
          return "Failed to connect";
        },
      });
    });

    return () => {
      unlistenAddTab.then((f) => f());
    };
  }, []);

  return (
    <MainLayout>
      <Header />
      <div className="flex h-full w-full overflow-y-scroll">
        <DataView />
      </div>
    </MainLayout>
  );
}

export default IndexPage;
