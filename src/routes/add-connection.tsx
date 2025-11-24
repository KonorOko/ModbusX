import AddConnectionPage from "@/windows/add-connection/add-connection-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add-connection")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddConnectionPage />;
}
