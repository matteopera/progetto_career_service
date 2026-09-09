import { Request, Response } from "express";
import generateInscriptionPdf from "../../service/company/pdf.service.js";
import fs from "fs";
import path from "path"
import { fileURLToPath } from "url";
import { findOnlineForm } from "../../service/company/form.service.js";
import { compiledForm, contentForm } from "../../types/form.js";
import { MongoError } from "mongodb";
import { DBError, handleDBError } from "../../errors/DBError.js";
export default async function getPdf(req: Request, res: Response) {
  try {
    const {formId}=req.params;

    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=PDF_Iscrizione.pdf")

    await generateInscriptionPdf(res, formId as string);
    return res.status(200);
  } catch (error) {
    console.error(`Errore durante la generazione del PDF: ${error}`);
    //MongoDB Errors
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }
    return res
      .status(500)
      .json({ message: "Impossibile ottenere il file richiesto" });
  }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function saveCompiledPDF(req:Request, res:Response){
  try{
    console.log("Ho ricevuto il piccione")
    const pdf=req.body
    console.log(typeof(pdf))

    const fileName=`filePDF.pdf`
    const filePath=path.join(__dirname,"../../savedPDF", fileName)
    console.log("Arrivo prima della chiamata")
    fs.writeFile(filePath,pdf, (error)=>{
      if(error){
        //gestione degli errori
        console.error(error)
        res.status(500).json({message:"Errore nel salvataggio del file"})
      }
      else{
        res.status(201).json({message:"Salvataggio avvenuto con successo"})
      }
      
    })

    
    
  }catch(error){
    console.error(error)
  }
  
}
