import { Request, Response } from "express";
import { findAllFaq, findForm } from "../service/azienda.service.js";
import { DBError, handleDBError } from "../errors/DBError.js";
import { MongoError } from "mongodb";
import * as z from "zod";
export async function getFaq(req: Request, res: Response) {
  try {
    const faq = await findAllFaq();
    res.status(200).json(faq);
  } catch (error) {
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    //codice generico 500 di errore del server
    if (error instanceof z.ZodError) {
      console.log("Errore nella struttura dei dati");
      console.error(error.flatten);
      return res.status(500).json({ message: "Errore del server" });
    } else {
      console.error(error);
      return res.status(500).json({ message: "Errore del server" });
    }
  }
}

export async function getForm(req: Request, res: Response) {
  try {
    const form = await findForm();

    //invio della risposta con il form
    res.status(200).json(form);
  } catch (error) {
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    //codice generico 500 di errore del server
    if (error instanceof z.ZodError) {
      console.log("Errore nella struttura dei dati");
      console.error(error.flatten());
      return res.status(500).json({ message: "Errore del server" });
    }
    console.error(error);
    return res.status(500).json({ message: "Errore del server" });
  }
}
