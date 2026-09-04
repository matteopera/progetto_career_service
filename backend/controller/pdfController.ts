import { Request, Response } from "express";
import { generatePDFPreviewAsync } from "../service/pdf.service.js";

export async function getPreviewPdfAsync(req: Request, res: Response) {
  try {
    //TODO: controllo id del pdf se esiste o meno

    // Impostazioni header di risposta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=TEST_MATTEO.pdf");

    await generatePDFPreviewAsync(null, res);

    return res.status(200);
  } catch (e) {
    console.log(
      "Errore durante la generazione della preview del PDF. Dettagli errore: ",
      e,
    );
    return res.status(500).json({ message: "Errore del server" });
  }
}
