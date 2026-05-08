import { Request,Response } from "express";
import { findAllFaq } from "../service/azienda.service.js";

export async function getFaq(req:Request,res:Response){
    try{
        console.log("Arrivo al controller");
        const faq=await findAllFaq();
        res.status(200).json(faq)
    }catch(error){
        console.error(error)
        res.status(500).json({"message":"Errore del server"})
    }
}