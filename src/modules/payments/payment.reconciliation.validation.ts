import { z } from "zod";

export const reconcilePaymentParamsSchema =
  z.object({
    id: z.uuid(),
  });