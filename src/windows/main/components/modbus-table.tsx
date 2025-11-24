import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTabs } from "@/hooks/useTabs";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { EditRegisterDialog } from "./edit-register-dialog";

export function ModbusTable({
  tabId,
  readOnly,
}: {
  tabId: number;
  readOnly: boolean;
}) {
  const values = useTabs((state) => state.tabs[tabId].values);

  const slicedValues = useMemo(() => {
    const result = [];
    for (let i = 0; i < values.length; i += 10) {
      result.push(values.slice(i, i + 10));
    }
    return result;
  }, [values]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-0.5">
      {slicedValues.map((values) => (
        <div
          key={values[0].address + values[values.length - 1].address}
          className="overflow-hidden"
        >
          <Table className="w-full border">
            <TableHeader>
              <TableRow>
                <TableHead className="bg-accent border-r">Address</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values.map((value) => (
                <TableRow key={value.address}>
                  <TableCell className="bg-accent border-r">
                    {value.address}
                  </TableCell>
                  <EditRegisterDialog cell={value} readOnly={readOnly}>
                    <TableCell
                      className={cn(
                        "font-mono",
                        !readOnly && "hover:bg-muted/20 cursor-pointer",
                      )}
                    >
                      {value.value}
                    </TableCell>
                  </EditRegisterDialog>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
