import { Request, Response } from "express";
import { findFaq } from "../../service/company/faq.service.js";
import { DBError, handleDBError } from "../../errors/DBError.js";
import { MongoError } from "mongodb";

export async function getFaq(req: Request, res: Response) {
  try {
    const faq = await findFaq();
    res.status(200).json(faq);
  } catch (error) {
    console.error("Errore durante il recupero delle faq");
    console.error(error);
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    return res.status(500).json({ message: "Impossibile recuperare le faq" });
  }
}
