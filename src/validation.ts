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

export const postZod = z.object({
  title: z.string().min(5, { message: "Title at least 5 characters long" }),
  description: z.string().optional(),
  image: z.string().optional(),
});

export type postZod = z.infer<typeof postZod>;
