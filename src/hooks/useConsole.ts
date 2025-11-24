import { create } from "zustand";

interface ConsoleState {
  isOpen: boolean;
  isMaximized: boolean;
  toggleOpen: () => void;
  toggleMaximized: () => void;
}

export const useConsole = create<ConsoleState>((set) => ({
  isOpen: false,
  isMaximized: false,
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMaximized: () => set((state) => ({ isMaximized: !state.isMaximized })),
}));
