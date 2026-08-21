import { FAQArrayZod } from "@/types/FAQType";
import * as z from "zod";
export async function getFAQ() {
  try {
    const url = "http://localhost:3000/api/aziende/FAQ";
    //chiamata api al server
    const res = await fetch(url);

    //Errore se il codice non è 200
    if (!res.ok) {
      console.error(`Errore HTTP: ${res.status}:${res.statusText}`);
      return []; //ritorno di un array vuoto
    }

    const f = await res.json();

    //controllo dei dati in ingresso

    const faq = FAQArrayZod.safeParse(f);
    if (!faq.success) {
      console.error(faq.error);
      return []; //ritorno di un array vuoto
    }
    return faq.data;
  } catch (error) {
    console.error(error);
    return []; //ritorno di un array vuoto
  }
}
