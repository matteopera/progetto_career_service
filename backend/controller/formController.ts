import { MongoError } from "mongodb";
import { findFormsAsync } from "../db/form.js";
import { Request, Response } from "express";
import { DBError, handleDBError } from "../errors/DBError.js";

export async function getFormsAsync(req: Request, res: Response) {
  try {
    const forms = await findFormsAsync();
    return res.status(200).json(forms);
  } catch (error) {
    console.log("Errore durante il recupero dei form", error);
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    return res.status(500).json({ message: "Impossibile recuperare i form" });
  }
}
