import { useEffect } from "react";
import useSettings from "./useSettings";
import { UnlistenFn } from "@tauri-apps/api/event";
import { info } from "@tauri-apps/plugin-log";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export function useSyncSettings() {
  const reloadFromDisk = useSettings((state) => state.reloadFromDisk);
  useEffect(() => {
    let unlisten: UnlistenFn | null = null;

    (async () => {
      const window = getCurrentWebviewWindow();
      unlisten = await window.listen("settings-update", () => {
        info("Syncing settings...");
        reloadFromDisk();
      });
    })();

    return () => {
      unlisten?.();
    };
  }, []);

  return null;
}
