import { create } from "zustand";
import { ModbusAddress, ModbusConfig, TabState } from "@/types";

interface ModbusTabsState {
  tabs: Record<number, TabState>;
  activeTabId: number | null;

  addTab: (id: number, path: string) => void;
  getTabsCount: () => number;
  setValues: (tabId: number, values: ModbusAddress[]) => void;

  closeTab: (tabId: number) => void;
  setActiveTab: (tabId: number | null) => void;

  updateModbusConfig: (tabId: number, partial: Partial<ModbusConfig>) => void;
  setPollingInterval: (tabId: number, ms: number) => void;

  setTabError: (tabId: number, error: string | null) => void;
}

const initialTabState: Omit<TabState, "tabId"> = {
  values: [],
  polling: {
    intervalMs: 1000,
    isActive: true,
  },
  modbusConfig: {
    count: 10,
    displayFormat: "decimal",
    registerType: "holding",
    startAddress: 0,
    path: "",
    slaveId: 1,
  },
  error: null,
};

export const useTabs = create<ModbusTabsState>((set, get) => ({
  tabs: {},
  activeTabId: null,

  addTab: (id: number, path: string) => {
    const newTab: TabState = {
      ...initialTabState,
      tabId: id,
      modbusConfig: { ...initialTabState.modbusConfig, path },
    };
    set((prev) => ({ ...prev, tabs: { ...prev.tabs, [id]: newTab } }));
  },
  getTabsCount: () => {
    const tabs = get().tabs;
    return Object.keys(tabs).length;
  },
  setValues: (tabId: number, newValues: ModbusAddress[]) =>
    set((state) => ({
      ...state,
      tabs: {
        ...state.tabs,
        [tabId]: {
          ...state.tabs[tabId],
          values: newValues,
        },
      },
    })),
  setActiveTab: (tabId: number | null) => {
    set((prev) => ({
      ...prev,
      activeTabId: tabId,
    }));
  },
  closeTab: (tabId: number) => {
    const tabs = get().tabs;
    const newTabs = { ...tabs };
    delete newTabs[tabId];
    set((prev) => ({
      ...prev,
      tabs: newTabs,
    }));
  },
  updateModbusConfig: (tabId: number, partial: Partial<ModbusConfig>) => {
    set((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [tabId]: {
          ...prev.tabs[tabId],
          modbusConfig: { ...prev.tabs[tabId].modbusConfig, ...partial },
        },
      },
    }));
  },
  setPollingInterval: (tabId: number, ms: number) => {
    set((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [tabId]: {
          ...prev.tabs[tabId],
          polling: { ...prev.tabs[tabId].polling, intervalMs: ms },
        },
      },
    }));
  },
  setTabError: (tabId: number, error: string | null) => {
    set((prev) => ({
      ...prev,
      tabs: {
        ...prev.tabs,
        [tabId]: {
          ...prev.tabs[tabId],
          error,
        },
      },
    }));
  },
}));
