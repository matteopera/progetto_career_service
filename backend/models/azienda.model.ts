import * as z from "zod";


export const FAQ=z.object({
    _id:z.string(),
    domanda:z.string(),
    risposta:z.string()
})

export const FAQs=z.array(FAQ)

