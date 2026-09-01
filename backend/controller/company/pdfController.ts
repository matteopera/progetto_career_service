import { Request, Response } from "express";
import generateInscriptionPdf from "../../service/company/pdf.service.js";
import { findOnlineForm } from "../../service/company/form.service.js";
import { compiledForm, contentForm } from "../../types/form.js";
import { MongoError } from "mongodb";
import { DBError, handleDBError } from "../../errors/DBError.js";
export default async function getPdf(req: Request, res: Response) {
  try {
    const {formId}=req.params;

    generateInscriptionPdf(res, formId as string);

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
