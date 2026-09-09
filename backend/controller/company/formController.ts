import { MongoError, ObjectId } from "mongodb";
import {
  findOnlineForm,
  insertCompiledForm,
} from "../../service/company/form.service.js";
import { Request, Response } from "express";
import { DBError, handleDBError } from "../../errors/DBError.js";
import { check } from "zod/mini";
import { zodCompiledForm } from "../../types/form.js";

export async function getOnlineForm(req: Request, res: Response) {
  try {
    const form = await findOnlineForm();

    return res.status(200).json(form);
  } catch (error) {
    console.error(`Errore durante il salvataggio del form compilato: ${error}`);
    console.error(error);
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

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

    console.log(`L'id messo in stringa è il seguente:${idAsString}`);
    //creating the response

    return res
      .status(201)
      .json({ message: "Iscrizione salvata con successo", _id: idAsString });
  } catch (error) {
    console.error(`Errore durante il salvataggio del form compilato: ${error}`);
    //MongoDB Errors
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }
    return res.status(500).json({ message: "Impossibile salvare il form" });
  }
}
