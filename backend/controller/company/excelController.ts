import generateCompaniesExcel from "../../service/company/excel.service.js";
import { Request,Response } from "express";
export default async function getCompanyExcel(req:Request,res:Response){
    //richiesta api che poi verrà spostata in admin per ottenere il file excel delle aziende
    try{
        const buffer=await generateCompaniesExcel()
        res.setHeader('Content-Disposition', 'attachment; filename=NomiECognomi.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer)
        
    }catch(error){
        console.error(error);
        res.status(500).json({"message":"tutto storto"})
    }
}