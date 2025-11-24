import { WindowHeader } from "@/components/window-header";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-full flex-col select-none">
      <WindowHeader />
      {children}
    </main>
  );
}
