import z from "zod"

export const zodFaq=z.object({
    question:z.string(),
    answer:z.string()
})

export const zodFaqList=z.array(zodFaq)

export type faqType=z.infer<typeof zodFaq>

export type faqListType=z.infer<typeof zodFaqList>