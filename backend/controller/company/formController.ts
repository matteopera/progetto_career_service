import { MongoError } from "mongodb";
import { findOnlineForm, insertCompiledForm, insertForm } from "../../service/company/form.service.js";
import { Request, Response } from "express";
import { DBError, handleDBError } from "../../errors/DBError.js";
import { check } from "zod/mini";
import { zodCompiledForm } from "../../types/form.js";

export async function getOnlineForm(req:Request, res:Response){
    try{
        const form=await findOnlineForm()

        return res.status(200).json(form)

    }catch(error){
        console.error(`Errore durante il salvataggio del form compilato: ${error}`)
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

        //check with zod
        const checkedCompiledForm=zodCompiledForm.parse(uploadedData)

        await insertCompiledForm(checkedCompiledForm)

        //creating the response
        return res.status(201)
    }catch(error){
        console.error(`Errore durante il salvataggio del form compilato: ${error}`)
        //MongoDB Errors
        if (error instanceof MongoError) {
              const errorRes: DBError = handleDBError(error);
              return res.status(errorRes[0]).json({ message: errorRes[1] });
            }
        return res.status(500).json({ message: "Impossibile salvare il form" });   
    }
}