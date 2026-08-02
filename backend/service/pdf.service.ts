import { FormTemplate } from "../types/form.js";
import { Response } from "express";
import PDFDocument from "pdfkit";

export async function generatePDFPreviewAsync(
  template: FormTemplate | null,
  res: Response,
) {
  // Non gestisco eccezione di generazione, viene gestita dal controller

  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(12).text("TEST");
  doc.end();
}
