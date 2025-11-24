import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useConsole } from "@/hooks/useConsole";
import { cn } from "@/lib/utils";
import { EllipsisVertical, Maximize2, Minimize2, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./ui/button";

export function Console() {
  const open = useConsole((state) => state.isOpen);
  const maximized = useConsole((state) => state.isMaximized);
  const toggleOpen = useConsole((state) => state.toggleOpen);
  const toggleMaximized = useConsole((state) => state.toggleMaximized);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "j") {
        event.preventDefault();
        toggleOpen();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleOpen]);
  return (
    <ResizablePanelGroup
      direction="vertical"
      className="pointer-events-none fixed right-0 bottom-0 left-0 opacity-80"
    >
      <ResizablePanel
        className="invisible -z-50 select-none"
        defaultSize={75}
      ></ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        defaultSize={25}
        maxSize={maximized ? 100 : 70}
        minSize={maximized ? 100 : 15}
        onDoubleClick={toggleMaximized}
        collapsible={maximized ? false : true}
        collapsedSize={10}
        onCollapse={open ? toggleOpen : () => undefined}
        onExpand={open ? () => undefined : toggleOpen}
        className={cn(
          "pointer-events-auto z-10 h-3/4 border-t bg-zinc-800 opacity-80",
          !open && "hidden",
        )}
      >
        <HeaderConsole />
        <div className="flex-1"></div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function HeaderConsole() {
  const toggleOpen = useConsole((state) => state.toggleOpen);
  const toggleMaximized = useConsole((state) => state.toggleMaximized);
  const maximized = useConsole((state) => state.isMaximized);
  return (
    <div className="flex w-full items-center justify-end text-white">
      <Button size={"icon"} variant={"ghost"}>
        <EllipsisVertical className="h-4 w-4" />
      </Button>
      <Button size={"icon"} variant={"ghost"} onClick={toggleMaximized}>
        {maximized ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
      <Button size={"icon"} variant={"ghost"} onClick={toggleOpen}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
