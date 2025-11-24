import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect } from "react";

export function useAvoidFlashWindow() {
  useEffect(() => {
    const webview = getCurrentWebviewWindow();
    webview.show();
    webview.setFocus();
  }, []);
}
