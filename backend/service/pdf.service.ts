import { Response } from "express";
import PDFDocument from "pdfkit";
import { contentForm } from "../types/form.js";
import { contentFormTest } from "../test-form/test.js";

export async function generatePDFPreviewAsync(
  template: contentForm | null,
  res: Response,
) {
  // Non gestisco eccezione di generazione, viene gestita dal controller

  const doc = new PDFDocument();
  doc.pipe(res);

  // Logo università in alto a sinistra
  doc.image("public/logo_univr.png", 20, 20, { width: 150 });

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(contentFormTest.formTitle, { align: "center" });
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(contentFormTest.formSubtitle, { align: "center" });

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(contentFormTest.formNote, { align: "center" });

  doc.end();
}
