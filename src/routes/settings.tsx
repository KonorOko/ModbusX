import SettingsPage from "@/windows/settings/settings-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SettingsPage />;
}
