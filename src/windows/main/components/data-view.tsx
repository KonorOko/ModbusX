import { useTabs } from "@/hooks/useTabs";
import { DataViewContent } from "./data-view-content";
import { DataViewToolbar } from "./data-view-toolbar";

export function DataView() {
  const activeTabId = useTabs((state) => state.activeTabId);

  return (
    <section className="flex h-full w-full flex-col border">
      {activeTabId ? (
        <>
          <DataViewToolbar tabId={activeTabId} />
          <div className="flex-1 overflow-auto">
            {<DataViewContent tabId={activeTabId} />}
          </div>
        </>
      ) : null}
    </section>
  );
}
