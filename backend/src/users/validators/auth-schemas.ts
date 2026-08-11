import { z } from "zod";

const emailSchema = z.string().trim().toLowerCase().email("email must be valid");
const passwordSchema = z.string().min(8, "password must be at least 8 characters long");

export const signInSchema = z.object({
  username: z.string().trim().min(1, "username must be a non-empty string"),
  email: emailSchema,
  password: passwordSchema,
});

export const logInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
