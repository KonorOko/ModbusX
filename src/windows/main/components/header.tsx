import { Button, buttonVariants } from "@/components/ui/button";
import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/utils";
import { TabState } from "@/types";
import { invoke } from "@tauri-apps/api/core";
import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { error } from "@tauri-apps/plugin-log";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function Header() {
  const tabs = useTabs((state) => state.tabs);
  const closeTab = useTabs((state) => state.closeTab);
  const activeTabId = useTabs((state) => state.activeTabId);
  const setActiveTab = useTabs((state) => state.setActiveTab);
  const currentTab = useTabs((state) =>
    activeTabId != null ? state.tabs[activeTabId] : undefined,
  );

  const handleCreateWindow = async () => {
    try {
      await invoke("create_window", {
        url: "add-connection",
        title: "New Connection",
        visible: false,
        width: 400,
        height: 580,
        maximizable: false,
        resizable: false,
      });
    } catch (e: unknown) {
      if (
        (e as string).includes(
          "a webview with label `add-connection` already exists",
        )
      ) {
        const allWindows = await getAllWebviewWindows();
        const window = allWindows.find((w) => w.label === "add-connection");
        if (window) {
          window.show();
          window.setFocus();
        }
      }
      error(e as string);
    }
  };

  const handleCloseTab = async (tabId: number) => {
    try {
      await invoke("close_connection", { id: tabId });
      const newActiveTabId =
        Object.values(tabs).find((t: TabState) => t.tabId !== tabId)?.tabId ??
        null;
      setActiveTab(newActiveTabId);
      closeTab(tabId);
    } catch (e: unknown) {
      error(e as string);
    }
  };

  const handleCopyPath = async () => {
    if (!currentTab || !currentTab.modbusConfig) return;
    await navigator.clipboard.writeText(currentTab.modbusConfig.path || "");
    toast.info("Path copied to clipboard");
  };

  return (
    <header className="box-border flex h-8 items-center justify-between">
      <div className="flex items-center">
        <div className="box-border flex aspect-square items-center justify-center border-x p-0.5">
          <Button
            size={"icon"}
            variant={"ghost"}
            className="box-border size-7 transition-none"
            onClick={handleCreateWindow}
          >
            <Plus />
          </Button>
        </div>
        {Object.values(tabs).map((tab) => (
          <Button
            key={tab.tabId.toString()}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "text-muted-foreground hover:bg-background box-border flex h-8 items-center gap-x-2 rounded-none border-x-0 border-y-0 px-2 py-0.5 text-xs transition-none",
              activeTabId === tab.tabId &&
                "bg-accent text-foreground hover:bg-accent",
            )}
            onClick={() => setActiveTab(tab.tabId)}
          >
            Conexion {tab.tabId}
            <div
              role="button"
              className="hover:bg-muted hover:text-primary hover:border-border flex size-[2ch] cursor-pointer items-center justify-center rounded-md border border-transparent p-3 font-light"
              onClick={() => handleCloseTab(tab.tabId)}
            >
              x
            </div>
          </Button>
        ))}
      </div>
      <div className="flex items-center">
        <div
          className="box-border flex h-8 w-28 cursor-pointer items-center justify-center border-l px-2 py-0.5 text-xs font-light"
          onClick={() => handleCopyPath()}
        >
          {currentTab ? currentTab.modbusConfig.path : "Disconnected"}
        </div>
        <div className="box-border flex size-8 items-center justify-center border-l py-0.5">
          {(currentTab === undefined ||
            currentTab.polling.isActive === false) && (
            <span className="bg-secondary size-3 rounded-full shadow"></span>
          )}
          {currentTab?.polling.isActive === true && (
            <span className="size-3 rounded-full bg-green-500 shadow"></span>
          )}
          {currentTab?.error && (
            <span className="size-3 rounded-full border bg-red-500 shadow"></span>
          )}
        </div>
      </div>
    </header>
  );
}
