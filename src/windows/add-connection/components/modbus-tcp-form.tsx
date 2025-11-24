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
import { Separator } from "@/components/ui/separator";
import { modbusFormSchema } from "@/schemas/modbus";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe } from "lucide-react";
import { useForm } from "react-hook-form";
import { ModbusFormValues, TCPFormValues } from "../types";
import { FormSection, FormSectionHeader } from "./form-section";

const defaultTCPValues: Partial<TCPFormValues> = {
  host: "",
  port: 5020,
  slaveId: 1,
  timeout: 1000,
  retries: 3,
  autoReconnect: true,
  reconnectInterval: 5000,
};

export function ModbusTCPForm({
  onTCPSubmit,
}: {
  onTCPSubmit: (data: ModbusFormValues) => void;
}) {
  const tcpForm = useForm<ModbusFormValues>({
    resolver: zodResolver(modbusFormSchema),
    defaultValues: {
      type: "TCP",
      ...defaultTCPValues,
    },
  });
  return (
    <section className="flex h-full flex-col p-4">
      <h1 className="mb-3 font-semibold">Modbus TCP Configuration</h1>
      <Form {...tcpForm}>
        <form
          onSubmit={tcpForm.handleSubmit(onTCPSubmit)}
          className="flex h-full flex-1 flex-col gap-y-6"
        >
          <FormSection className="space-y-3">
            <FormSectionHeader>Modbus</FormSectionHeader>
            <div className="flex gap-3">
              <FormField
                control={tcpForm.control}
                name="host"
                render={({ field }) => (
                  <FormItem className="w-3/5">
                    <FormLabel>Host</FormLabel>
                    <InputGroup>
                      <InputGroupAddon>
                        <Globe />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput placeholder="192.168.0.1" {...field} />
                      </FormControl>
                    </InputGroup>
                  </FormItem>
                )}
              />
              <FormField
                control={tcpForm.control}
                name="port"
                render={({ field }) => (
                  <FormItem className="w-2/5">
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input placeholder="5020" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </FormSection>

          <Separator />

          <FormSection className="space-y-3">
            <FormSectionHeader>General</FormSectionHeader>
            <div className="flex gap-3">
              <FormField
                control={tcpForm.control}
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
                control={tcpForm.control}
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

          {/*<FormSection className="space-y-4">
          <FormField
            control={tcpForm.control}
            name="autoReconnect"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                <FormControl>
                  <Checkbox
                    className="h-4 w-4 rounded-sm border"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    Auto-reconnect
                  </FormLabel>
                  <FormDescription>
                    Automatically reconnect if connection is lost
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {tcpForm.watch("autoReconnect") && (
            <FormField
              control={tcpForm.control}
              name="reconnectInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reconnect Interval (ms)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5000"
                      min={100}
                      max={60000}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Time between reconnection attempts
                  </FormDescription>
                </FormItem>
              )}
            />
          )}
        </FormSection>*/}

          <Button type="submit" className="mt-auto w-full">
            Connect to TCP
          </Button>
        </form>
      </Form>
    </section>
  );
}
