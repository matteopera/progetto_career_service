import * as z from "zod";

export const FAQZod=z.object({
    _id:z.string(),
    domanda:z.string(),
    risposta:z.string()
});

export const FAQArrayZod=z.array(FAQZod);

export type FAQ=z.infer<typeof FAQZod>;