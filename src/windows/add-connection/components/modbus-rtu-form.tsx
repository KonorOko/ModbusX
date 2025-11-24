import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { rtuFormSchema } from "@/schemas/modbus";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoke } from "@tauri-apps/api/core";
import { RotateCcw, Usb } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ModbusFormValues, RTUFormValues } from "../types";
import { FormSection, FormSectionHeader } from "./form-section";

const defaultRTUValues: Partial<RTUFormValues> = {
  port: "",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: "1",
  slaveId: 1,
  timeout: 1000,
  retries: 3,
};

export function ModbusRTUForm({
  onRTUSubmit,
}: {
  onRTUSubmit: (data: ModbusFormValues) => void;
}) {
  const [ports, setPorts] = useState<string[]>([]);
  const rtuForm = useForm<ModbusFormValues>({
    resolver: zodResolver(rtuFormSchema),
    defaultValues: {
      type: "RTU",
      ...defaultRTUValues,
    },
  });

  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const response = await invoke<string[]>("get_ports");
        setPorts(response);
      } catch (error) {
        console.error("Failed to fetch ports:", error);
      }
    };

    fetchPorts();
  }, []);
  return (
    <section className="flex h-full flex-col p-4">
      <h1 className="mb-3 font-semibold">Modbus RTU Configuration</h1>
      <Form {...rtuForm}>
        <form
          onSubmit={rtuForm.handleSubmit(onRTUSubmit)}
          className="flex h-full flex-1 flex-col gap-y-6"
        >
          <FormSection className="space-y-3">
            <FormSectionHeader>Modbus</FormSectionHeader>
            <div className="flex items-end">
              <FormField
                control={rtuForm.control}
                name="port"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Port</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full rounded-r-none">
                          <Usb />
                          <SelectValue placeholder="Select Port" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ports.length > 0 ? (
                          ports.map((port) => (
                            <SelectItem key={port} value={port}>
                              {port}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="disabled" disabled>
                            No ports available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <Button
                variant={"outline"}
                type="button"
                className="rounded-l-none border-l-0"
              >
                <RotateCcw />
              </Button>
            </div>
          </FormSection>

          <FormSection className="grid grid-cols-2 gap-4">
            <FormField
              control={rtuForm.control}
              name="baudRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baud Rate</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Baud rate" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600].map(
                        (rate) => (
                          <SelectItem key={rate} value={rate.toString()}>
                            {rate} bps
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={rtuForm.control}
              name="dataBits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Bits</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Data bits" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[5, 6, 7, 8].map((bits) => (
                        <SelectItem key={bits} value={bits.toString()}>
                          {bits} bits
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </FormSection>

          <FormSection className="grid grid-cols-2 gap-4">
            <FormField
              control={rtuForm.control}
              name="parity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parity</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Parity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["none", "even", "odd", "mark", "space"].map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={rtuForm.control}
              name="stopBits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop Bits</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Stop bits" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["1", "2"].map((stop) => (
                        <SelectItem key={stop} value={stop}>
                          {stop} bit{stop === "1" ? "" : "s"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </FormSection>

          <Separator />

          <FormSection className="space-y-3">
            <FormSectionHeader>General</FormSectionHeader>
            <div className="flex gap-3">
              <FormField
                control={rtuForm.control}
                name="timeout"
                render={({ field }) => (
                  <FormItem className="w-3/5">
                    <FormLabel>Timeout </FormLabel>
                    <InputGroup>
                      <FormControl>
                        <InputGroupInput
                          placeholder="1000"
                          disabled
                          {...field}
                        />
                      </FormControl>
                      <InputGroupAddon align={"inline-end"}>
                        <InputGroupText>ms</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormItem>
                )}
              />

              <FormField
                control={rtuForm.control}
                name="retries"
                render={({ field }) => (
                  <FormItem className="w-2/5">
                    <FormLabel>Retries</FormLabel>
                    <FormControl>
                      <Input placeholder="3" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <Button type="submit" className="mt-auto w-full">
            Connect to RTU
          </Button>
        </form>
      </Form>
    </section>
  );
}
