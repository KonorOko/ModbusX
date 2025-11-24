export function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-full flex-col select-none">
      {children}
    </main>
  );
}
