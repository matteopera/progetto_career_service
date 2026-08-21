import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, { error: "Email è obbligatoria" }).email({ error: "Email non valida" }),
    password: z.string().min(8, { error: "Password troppo corta" }),
    rememberMe: z.boolean()
});

export type LoginType = z.infer<typeof loginSchema>;