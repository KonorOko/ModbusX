import { useAvoidFlashWindow } from "@/hooks/useAvoidFlashWindow";
import { useSyncSettings } from "@/hooks/useSyncSettings";
import { createRootRoute, Outlet } from "@tanstack/react-router";

const RootLayout = () => {
  useAvoidFlashWindow();
  useSyncSettings();

  return (
    <>
      <Outlet />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
