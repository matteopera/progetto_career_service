import { Request, Response } from "express";
import { generatePDFPreviewAsync } from "../service/pdf.service.js";
import fs from "fs";
import { ZipArchive } from "archiver";
import { findCompiledFormByInfo } from "../db/formDb.js";

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

    // Ottengo solamente id dei form compilati del form richiest
    const compiledForms = await findCompiledFormByInfo(idForm);

    fs.readdir(folderPdf, (err, files) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Errore imprevisto durante lettura dei PDF" });
      }

      files.forEach((file) => {
        if (
          compiledForms.some((compiledForm) =>
            file.includes(compiledForm._id.toString()),
          )
        ) {
          const filePath = `${folderPdf}/${file}`;
          archive.append(fs.createReadStream(filePath), { name: file });
        }
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

///Endpoint per scarica il form compilato di una specifica azienda
export async function downloadCompiledFormAsync(req: Request, res: Response) {
  try {
    const { idCompiledForm } = req.body;

    if (!idCompiledForm) {
      return res.status(400).json({ message: "Id form compilato mancante" });
    }

    const pathFile = `./savedPDF/${idCompiledForm}.pdf`;

    if (!fs.existsSync(pathFile)) {
      return res.status(500).json({ message: "Il file PDF non esiste" });
    }

    res.download(pathFile, `${idCompiledForm}.pdf`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Errore imprevisto durante il download");
      }
    });
  } catch (e) {
    console.log(
      "Errore durante la generazione della preview del PDF. Dettagli errore: ",
      e,
    );
    return res.status(500).json({ message: "Errore del server" });
  }
}
