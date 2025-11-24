import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTabs } from "@/hooks/useTabs";
import { ModbusAddress } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoke } from "@tauri-apps/api/core";
import { error } from "@tauri-apps/plugin-log";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function EditRegisterDialog({
  cell,
  children,
  readOnly,
}: {
  cell: ModbusAddress;
  children: React.ReactNode;
  readOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const activeTabId = useTabs((state) => state.activeTabId);
  if (!activeTabId) return null;
  const tab = useTabs((state) => state.tabs[activeTabId]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: cell.value,
    },
  });

  useEffect(() => {
    const inputValue = document.getElementById(
      `value-${cell.value}`,
    ) as HTMLInputElement;
    if (inputValue) {
      inputValue.select();
    }
    form.setValue("value", cell.value);
  }, [cell.value]);

  const handleDialogOpenChange = (open: boolean) => {
    if (readOnly) {
      setOpen(false);
    } else {
      setOpen(open);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (tab.modbusConfig.registerType === "coil") {
        await invoke("write_single_coil", {
          id: activeTabId,
          address: cell.address,
          value: Boolean(values.value),
          slaveId: tab.modbusConfig.slaveId,
        });
      } else if (tab.modbusConfig.registerType === "holding") {
        await invoke("write_single_register", {
          id: activeTabId,
          address: cell.address,
          value: values.value,
          slaveId: tab.modbusConfig.slaveId,
        });
      }

      setOpen(false);
    } catch (e) {
      error("Error writing register: " + e);
    }
  };

  return (
    <Dialog
      key={cell.address}
      open={open}
      onOpenChange={handleDialogOpenChange}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>Address:</span>
            <span className="font-mono">{cell.address}</span>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-3">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter value" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const formSchema = z.object({
  value: z.coerce.number().min(0).max(65535),
});
