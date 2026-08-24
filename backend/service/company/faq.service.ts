import z from "zod";
import { findOnlineFaq } from "../../db/faq.js";
import { dbFaqList } from "../../types/faq.js";
export async function findFaq(){
    //db query
    const faq=await findOnlineFaq();

    //parsing the faq
    const parsedFaq=dbFaqList.parse(faq)

    //removing ids from faq
    const withoutId=parsedFaq.map(({_id,... body})=>body)

    //returning the faq
    return withoutId

}