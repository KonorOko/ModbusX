import { invoke } from "@tauri-apps/api/core";
import { getAllWebviewWindows } from "@tauri-apps/api/webviewWindow";
import { error } from "@tauri-apps/plugin-log";
import { Settings } from "lucide-react";
import { Button } from "./ui/button";

export function WindowHeader() {
  const handleOpenSettings = async () => {
    try {
      await invoke("create_window", {
        url: "settings",
        title: "Settings",
        visible: false,
        height: 600,
        width: 650,
      });
    } catch (e: unknown) {
      if (
        (e as string).includes("a webview with label `settings` already exists")
      ) {
        const allWindows = await getAllWebviewWindows();
        const window = allWindows.find((w) => w.label === "settings");
        if (window) {
          window.show();
          window.setFocus();
        }
      }
      error(e as string);
    }
  };

  return (
    <div
      data-tauri-drag-region
      className="z-50 flex h-9 w-full items-center justify-between border-b p-0.5"
    >
      <div className="h-9 w-24 pl-2" />
      <div></div>
      <div className="w-24 text-end">
        <Button
          variant={"ghost"}
          size={"icon"}
          className="aspect-square h-8"
          onClick={handleOpenSettings}
        >
          <Settings />
        </Button>
      </div>
    </div>
  );
}
