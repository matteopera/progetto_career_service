import { findFaq } from "../db/faq.js";
import {FAQs} from "../models/azienda.model.js"


export async function findAllFaq(){
    try{
        console.log("Arrivo al service");
        //richiesta al mongoDB
        const res=await findFaq();
        //validazione dei dati ottenuti
        const faq=FAQs.parse(res);
        console.log(faq);
        return faq;
    }catch(error){
        console.error(error)
    }
}