import { create } from "zustand";
import { load, Store } from "@tauri-apps/plugin-store";
import { error } from "@tauri-apps/plugin-log";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export type Theme = "light" | "dark";
export type AddressLayout = "table" | "offset" | "grid";

export interface Settings {
  theme: Theme;
  addressLayout: AddressLayout;
  readOnly: boolean;
}

const defaultSettings: Settings = {
  theme: "light",
  addressLayout: "table",
  readOnly: false,
};

let storeInstance: Store | null = null;

export const getStoreInstance = async (): Promise<Store> => {
  if (!storeInstance) {
    storeInstance = await load("settings.json", {
      autoSave: true,
      defaults: defaultSettings as unknown as { [key: string]: unknown },
    });

    await storeInstance.save();
  }
  return storeInstance;
};

const saveSettings = async (partialSettings: Partial<Settings>) => {
  try {
    const store = await getStoreInstance();

    for (const key of Object.keys(partialSettings) as Array<keyof Settings>) {
      await store.set(key, partialSettings[key]);
    }

    await store.save();
  } catch (e) {
    error("Error saving settings:" + e);
  }
};

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

const applyTheme = (theme: string) => {
  if (typeof window === "undefined") return;
  const root = window.document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(theme);
};

export const initializeSettingsFromStore = async () => {
  const store = await getStoreInstance();
  const settings: Settings = { ...defaultSettings };

  for (const key of Object.keys(defaultSettings) as Array<keyof Settings>) {
    const value = await store.get(key);
    if (value !== null && value !== undefined) {
      (settings[key] as typeof value) = value;
    }
  }

  if (!settings.theme) {
    settings.theme = getSystemTheme();
  }

  applyTheme(settings.theme);
  useSettings.getState().setSettings(settings);
  return settings;
};

initializeSettingsFromStore();

interface SettingsStore {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  updateSetting: (
    key: keyof Settings,
    value: Settings[keyof Settings],
  ) => Promise<void>;
  reloadFromDisk: () => void;
}

const useSettings = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  setSettings: (settings) => set({ settings }),
  updateSetting: async (
    key: keyof Settings,
    value: Settings[keyof Settings],
  ) => {
    set((state) => ({ settings: { ...state.settings, [key]: value } }));
    if (key === "theme") applyTheme(value as Theme);

    await saveSettings({ [key]: value });

    const window = getCurrentWebviewWindow();
    window?.emit("settings-update");
  },
  reloadFromDisk: async () => {
    try {
      const store = await getStoreInstance();
      await store.reload();
      const newSettings = await initializeSettingsFromStore();
      set({ settings: newSettings });
    } catch (e) {
      error("Error reloading settings from disk: " + e);
    }
  },
}));

export default useSettings;
