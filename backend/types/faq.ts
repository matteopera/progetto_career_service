import z from "zod"
import { ObjectId } from "mongodb"
export const dbFaq=z.object({
    _id:z.instanceof(ObjectId),
    question:z.string(),
    answer:z.string()
})

export const dbFaqList=z.array(dbFaq)
