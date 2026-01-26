import { z } from "zod";

export const promoSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  primaryColor: z.string(),
  secondaryColor: z.string(),
});

export type PromoProps = z.infer<typeof promoSchema>;
