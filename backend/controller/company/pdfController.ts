import { Request, Response } from "express";
import generateInscriptionPdf from "../../service/company/pdf.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  findCompiledForm,
  findOnlineForm,
} from "../../service/company/form.service.js";
import { compiledForm, contentForm } from "../../types/form.js";
import { MongoError } from "mongodb";
import { DBError, handleDBError } from "../../errors/DBError.js";
import multer from "multer";
import { findCompiledFormById } from "../../db/formDb.js";
export default async function getPdf(req: Request, res: Response) {
  try {
    const { formId } = req.params;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=PDF_Iscrizione.pdf",
    );

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

export async function saveCompiledPDF(req: Request, res: Response) {
  try {
    const file = req.file;
    const fileName = req.body.fileName; //id del form compilato e corrispondente al pdf

    if (!file || !fileName) {
      res.status(400).json({ message: "File o nome del file mancante" });
    } else {
      //controllo che il form corrispondente all'id esista
      const correspondingForm = await findCompiledForm(fileName);
      if (!correspondingForm) {
        return res
          .status(500)
          .json({ message: "Errore nel salvataggio del file" });
      } else {
        const filePath = path.join(
          __dirname,
          "../../savedPDF/",
          `${fileName}.pdf`,
        );
        fs.writeFile(filePath, file.buffer, (error) => {
          if (error) {
            console.error(error);
            return res
              .status(500)
              .json({ message: "Errore nel salvataggio del file" });
          }
          res
            .status(201)
            .json({ message: "Salvataggio avvenuto con successo" });
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Errore nel salvataggio del file" });
  }
}
