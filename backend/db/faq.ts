import { db } from "./db.js";

export async function findOnlineFaq(){
    const collection=db.collection("faq")
    const faq=collection.find({}).toArray()
    return faq
}