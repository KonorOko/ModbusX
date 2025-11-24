import { z } from "zod";

export const rtuFormSchema = z.object({
  type: z.literal("RTU"),
  port: z.string().min(1, "Port is required"),
  baudRate: z.coerce.number().int().min(1200).max(115200),
  dataBits: z.coerce.number().int().min(5).max(8),
  parity: z.enum(["none", "even", "odd", "mark", "space"]),
  stopBits: z.enum(["1", "1.5", "2"]),
  slaveId: z.coerce.number().int().min(1).max(247),
  timeout: z.coerce.number().int().min(100).max(10000),
  retries: z.coerce.number().int().min(0).max(10),
});

export const tcpFormSchema = z.object({
  type: z.literal("TCP"),
  host: z.string().min(1, "Host is required"),
  port: z.coerce.number().int().min(1).max(65535),
  slaveId: z.coerce.number().int().min(0).max(255),
  timeout: z.coerce.number().int().min(100).max(10000),
  retries: z.coerce.number().int().min(0).max(10),
  autoReconnect: z.boolean(),
  reconnectInterval: z.coerce.number().int().min(100).max(60000),
});

export const modbusFormSchema = z.discriminatedUnion("type", [
  rtuFormSchema,
  tcpFormSchema,
]);
