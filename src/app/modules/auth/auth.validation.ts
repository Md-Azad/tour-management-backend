import { z } from "zod";

export const changePasswordZodSchema = z.object({
  id: z.string(),
  newPassword: z.string(),
});
