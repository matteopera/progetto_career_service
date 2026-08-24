import { zodFaqList, type faqListType} from "@/types/FAQType"

export default async function faqApi(){
    const response=await fetch("/api/aziende/faq")

    if(!response.ok){
        console.error("Errore nella richiesta delle faq")
    }

    const faqJson=await response.json()
    //check with zod type
    const parsedFaqs=zodFaqList.parse(faqJson)

    return parsedFaqs
}