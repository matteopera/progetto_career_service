import { MongoError } from "mongodb";
import { findOnlineForm, insertForm } from "../../service/company/form.service.js";
import { Request, Response } from "express";
import { DBError, handleDBError } from "../../errors/DBError.js";

export async function getOnlineForm(req:Request, res:Response){
    try{
        const form=await findOnlineForm()

        return res.status(200).json(form)

    }catch(error){
        console.error("Errore durante il recupero del form")
        console.error(error)
        if (error instanceof MongoError) {
              const errorRes: DBError = handleDBError(error);
              return res.status(errorRes[0]).json({ message: errorRes[1] });
            }
        
        return res.status(500).json({ message: "Impossibile recuperare il form" });
        }
}

export async  function uploadForm(req:Request,res:Response){
    try{
        const uploadedData=req.body
        console.log(uploadedData)
        await insertForm()
    }catch(error){
        //handling errors
    }
}