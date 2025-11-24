import { create } from "zustand";

type ConnectionState = "connecting" | "connected" | "disconnected";

interface UseConnection {
  connection: ConnectionState;
  setConnection: (newConnection: ConnectionState) => void;
}

export const useConnection = create<UseConnection>((set) => ({
  connection: "disconnected",
  setConnection: (newConnection: ConnectionState) =>
    set({ connection: newConnection }),
}));
