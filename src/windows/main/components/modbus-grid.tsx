import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/utils";
import { ModbusAddress } from "@/types";
import { EditRegisterDialog } from "./edit-register-dialog";

export function ModbusGrid({
  tabId,
  readOnly,
}: {
  tabId: number;
  readOnly: boolean;
}) {
  const values = useTabs((state) => state.tabs[tabId].values);

  return (
    <div
      className={`grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-2`}
    >
      {values.map((cell: ModbusAddress) => (
        <EditRegisterDialog key={cell.address} cell={cell} readOnly={readOnly}>
          <div
            key={`${cell.address}-${cell.value}`}
            className={cn(
              "animate-blink flex flex-col rounded border p-2",
              !readOnly && "hover:bg-muted/20 cursor-pointer",
            )}
          >
            <div className="text-muted-foreground text-xs">{cell.address}</div>

            <div className={`mt-1 font-mono`}>{cell.value ?? "-"}</div>
          </div>
        </EditRegisterDialog>
      ))}
    </div>
  );
}
