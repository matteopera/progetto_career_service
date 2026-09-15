import { zodFaqList, type faqListType } from "@/types/FAQType";
import axios from "axios";
export default async function faqApi() {
  const response = await axios.get("/api/aziende/faq");

  const faqJson = await response.data;
  //check with zod type
  const parsedFaqs = zodFaqList.parse(faqJson);

  return parsedFaqs;
}
