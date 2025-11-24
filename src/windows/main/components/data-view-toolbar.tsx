import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/utils";
import { RegisterType } from "@/types";

export function DataViewToolbar({ tabId }: { tabId: number }) {
  const updateModbusConfig = useTabs((state) => state.updateModbusConfig);
  const setPollingInterval = useTabs((state) => state.setPollingInterval);
  const tab = useTabs((state) => state.tabs[tabId]);

  const { modbusConfig, polling } = tab;
  const { startAddress, registerType, count } = modbusConfig;
  const { intervalMs } = polling;

  return (
    <article className="bg-secondary flex flex-wrap items-center justify-between gap-6 border-y px-4 py-3">
      <div className="flex flex-wrap items-center gap-6">
        <ToolbarItem>
          <Label htmlFor="slaveId">Slave ID</Label>
          <Input
            id="slaveId"
            className="w-24"
            placeholder="0"
            value={modbusConfig.slaveId}
            onChange={(e) => {
              if (!/^\d*$/.test(e.target.value)) return;
              updateModbusConfig(tabId, {
                slaveId: Number(e.target.value),
              });
            }}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Label htmlFor="start-address">Start Address</Label>
          <Input
            id="start-address"
            className="w-24"
            placeholder="0"
            value={startAddress}
            onChange={(e) => {
              if (!/^\d*$/.test(e.target.value)) return;
              updateModbusConfig(tabId, {
                startAddress: Number(e.target.value),
              });
            }}
          />
        </ToolbarItem>

        <ToolbarItem>
          <Label htmlFor="count">Quantity</Label>
          <Input
            id="count"
            className="w-20"
            placeholder="10"
            value={count}
            onChange={(e) =>
              updateModbusConfig(tabId, {
                count: Number(e.target.value),
              })
            }
          />
        </ToolbarItem>

        <ToolbarItem>
          <Label htmlFor="register-type" className="whitespace-nowrap">
            Register Type
          </Label>
          <Select
            value={registerType}
            onValueChange={(newValue: RegisterType) =>
              updateModbusConfig(tabId, { registerType: newValue })
            }
          >
            <SelectTrigger id="register-type">
              <SelectValue placeholder="Select register type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Read/Write</SelectLabel>
                <SelectItem value="coil">Coils</SelectItem>
                <SelectItem value="holding">Holding Registers</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Read only</SelectLabel>
                <SelectItem value="discrete">Discrete Inputs</SelectItem>
                <SelectItem value="input">Input Registers</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ToolbarItem>
      </div>
      <ToolbarItem>
        <Label htmlFor="auto-refresh">Auto-refresh</Label>
        <Select
          value={intervalMs.toString()}
          onValueChange={(newValue) =>
            setPollingInterval(tabId, Number(newValue))
          }
        >
          <SelectTrigger id="auto-refresh" className="w-[120px]">
            <SelectValue placeholder="Select interval" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="500">0.5s</SelectItem>
            <SelectItem value="1000">1s</SelectItem>
            <SelectItem value="2000">2s</SelectItem>
            <SelectItem value="5000">5s</SelectItem>
          </SelectContent>
        </Select>
      </ToolbarItem>
    </article>
  );
}

function ToolbarItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // "[&>label]:text-muted-foreground flex gap-2 [&>label]:text-xs [&>label]:font-light",
        "[&>label]:text-muted-foreground flex flex-col gap-1 [&>label]:text-xs [&>label]:font-light",
        className,
      )}
    >
      {children}
    </div>
  );
}
