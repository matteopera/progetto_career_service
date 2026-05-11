import { MongoError } from "mongodb";
import { findFaq, formRequest } from "../db/company.js";
import {FAQs} from "../models/azienda.model.js"
import { DBError } from "../errors/DBError.js";

export async function findAllFaq(){
        //richiesta al mongoDB
        const res=await findFaq();
        //validazione dei dati ottenuti
        const faq=FAQs.parse(res);
        //restituzione dei dati ottenuti
        return faq;
}



export async function findForm(){
        const form=await formRequest();

        // TODO validazione del risultato

        return form;
}