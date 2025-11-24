import {
  modbusFormSchema,
  rtuFormSchema,
  tcpFormSchema,
} from "@/schemas/modbus";

export type TCPFormValues = z.infer<typeof tcpFormSchema>;
export type RTUFormValues = z.infer<typeof rtuFormSchema>;
export type ModbusFormValues = z.infer<typeof modbusFormSchema>;
