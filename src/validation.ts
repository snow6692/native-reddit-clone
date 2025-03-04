import z from "zod";

export const authZodForm = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
  password: z.string().min(6, {
    message: "Enter at least 6 characters long",
  }),
});
export type authZodForm = z.infer<typeof authZodForm>;
