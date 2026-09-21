import { Request, Response } from "express";
import { findFaq } from "../../service/company/faq.service.js";
import { MongoError } from "mongodb";

export async function getFaq(req: Request, res: Response) {
  try {
    const faq = await findFaq();
    res.status(200).json(faq);
  } catch (error) {
    console.error(`Errore durante il recupero delle faq ${error}`);
    return res.status(500).json({ message: "Impossibile recuperare le faq" });
  }
}
