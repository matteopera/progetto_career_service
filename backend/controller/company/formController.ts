import { MongoError, ObjectId } from "mongodb";
import {
  findFormById,
  findOnlineForm,
  insertCompiledForm,
} from "../../service/company/form.service.js";
import { Request, Response } from "express";
import { check } from "zod/mini";
import { zodCompiledForm } from "../../types/form.js";

export async function getOnlineForm(req: Request, res: Response) {
  try {
    const {contentForm} = await findOnlineForm();

    return res.status(200).json(contentForm);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "Impossibile recuperare il form" });
  }
}

export async function uploadForm(req: Request, res: Response) {
  try {
    const uploadedData = req.body;

    //check with zod
    const checkedCompiledForm = zodCompiledForm.parse(uploadedData);

    const _id = await insertCompiledForm(checkedCompiledForm);
    const idAsString = _id.toString();

    //creating the response

    return res
      .status(201)
      .json({ message: "Iscrizione salvata con successo", _id: idAsString });
  } catch (error) {
    console.error(`Errore durante il salvataggio del form compilato: ${error}`);
    return res.status(500).json({ message: "Impossibile salvare il form" });
  }
}


export async function getFormById(req: Request, res: Response){
  try{
    const {formId}=req.params

    const contentForm=await findFormById(formId as string);
    
    res.status(200).json(contentForm)
  }catch(error){
    return res.status(500).json({ message: "Impossibile recuparare il form" });
  }
}
