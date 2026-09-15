import generateCompaniesExcel from "../service/excel.service.js";
import { Request,Response } from "express";
export default async function getCompanyExcel(req:Request,res:Response){
    //richiesta api che poi verrà spostata in admin per ottenere il file excel delle aziende
    try{
        const {formId}=req.params
        const buffer=await generateCompaniesExcel(formId as string)
        res.setHeader('Content-Disposition', 'attachment; filename=NomiECognomi.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer)
        
    }catch(error){
        console.error(error);
        
        if(error instanceof Error && error.message==="Nessuna azienda legata al form richiesto"){
            res.status(404).json({"message":"Nessun azionda registrata sul form selezionato"})
        }
        res.status(500).json({"message":"Errore nella generazione del file excel"})
    }
}