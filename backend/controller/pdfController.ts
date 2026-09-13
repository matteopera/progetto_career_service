import { Request, Response } from "express";
import { generatePDFPreviewAsync } from "../service/pdf.service.js";
import fs from "fs";
import { ZipArchive } from "archiver";

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

export async function downloadCompiledFormsAsync(req: Request, res: Response) {
  try {
    const { idForm } = req.body;

    if (!idForm) {
      return res.status(400).json({ message: "Id form mancante" });
    }

    // TODO: prendere solamente i file con idForm Passato
    const folderPdf = "./savedPDF";
    const zipName = `${idForm}.zip`;

    const output = fs.createWriteStream(zipName);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    archive.pipe(output);

    fs.readdir(folderPdf, (err, files) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Errore imprevisto durante lettura dei PDF" });
      }

      files.forEach((file) => {
        const filePath = `${folderPdf}/${file}`;
        archive.append(fs.createReadStream(filePath), { name: file });
      });

      archive.finalize();
      output.on("close", () => {
        res.download("./" + zipName, zipName, (err) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send("Errore imprevisto durante il download");
          }

          fs.unlink(zipName, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      });
    });
  } catch (e) {
    console.log(
      "Errore durante la generazione della preview del PDF. Dettagli errore: ",
      e,
    );
    return res.status(500).json({ message: "Errore del server" });
  }
}
