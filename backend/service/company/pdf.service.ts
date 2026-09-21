import { Response } from "express";
import PDFDocument from "pdfkit";
import { compiledForm, contentForm } from "../../types/form.js";
import { loadEnvFile } from "node:process";
import { findCompiledForm, findOnlineForm } from "./form.service.js";
export default async function generateInscriptionPdf(
  res: Response,
  idCompiledForm: string,
) {
  //fetching compiledForm
  const { contentForm } = await findOnlineForm();

  //fetching compiledForm by id
  const compiledForm: compiledForm = await findCompiledForm(idCompiledForm);

  //modifica delle info in stringa
  const doc = new PDFDocument();

  doc.pipe(res);

  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;
  doc.image("public/logo_univr.png", 20, 20, { width: 150 });
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(contentForm.formTitle, { align: "center" });
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(contentForm.formSubtitle, { align: "center" });

  if (contentForm.formNote !== "null") {
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(contentForm.formNote, { align: "center" });
  }

  contentForm.sections.forEach((s) => {
    doc.y = doc.y + 20;
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(s.sectionTitle, { align: "left", paragraphGap: 6 });
    if (s.sectionNote !== "null") {
      doc
        .fontSize(11)
        .font("Helvetica")
        .text(s.sectionNote, { align: "left", paragraphGap: 6 });
    }

    const left = doc.page.margins.left;
    const pageBottom = () => doc.page.height - doc.page.margins.bottom;

    // stato della riga corrente (solo per i campi text)
    let lastEndX: number | null = null;
    let rowTop: number | null = null;
    let rowHeight = 0;

    s.fields.forEach((f) => {
      if (f.fieldType === "text") {
        const hasNote = f.fieldNote !== "null";
        const titleText = `${f.fieldTitle}:    `;
        const valueText = `${compiledForm[s.sectionTitle][f.fieldTitle]}`;

        doc.fontSize(12).font("Helvetica-Bold");
        const titleWidth = doc.widthOfString(titleText);
        doc.fontSize(12).font("Helvetica");
        const valueWidth = doc.widthOfString(valueText);

        let noteWidth = 0;
        if (hasNote) {
          doc.fontSize(11).font("Helvetica");
          noteWidth = doc.widthOfString(f.fieldNote);
        }

        const cellWidth = Math.max(titleWidth + valueWidth, noteWidth);
        const noteHeight = hasNote ? 15 : 0;
        const cellHeight = noteHeight + 20;
        const gap = 30;

        const fitsOnLine =
          lastEndX !== null &&
          rowTop !== null &&
          lastEndX + gap + cellWidth <= left + pageWidth;

        let x: number;
        if (fitsOnLine) {
          x = lastEndX! + gap;
        } else {
          const newTop = rowTop === null ? doc.y : rowTop + rowHeight;
          if (newTop + cellHeight > pageBottom()) {
            doc.addPage();
            rowTop = doc.page.margins.top;
          } else {
            rowTop = newTop;
          }
          rowHeight = 0;
          x = left;
        }

        const y = rowTop!;

        if (hasNote) {
          doc
            .fontSize(11)
            .font("Helvetica")
            .text(f.fieldNote, x, y, { lineBreak: false });
        }
        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(titleText, x, y + noteHeight, { lineBreak: false });
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(valueText, x + titleWidth, y + noteHeight, {
            lineBreak: false,
          });

        lastEndX = x + cellWidth;
        rowHeight = Math.max(rowHeight, cellHeight);

        doc.x = left;
        doc.y = rowTop! + rowHeight;
      }

      if (f.fieldType === "check" || f.fieldType === "radio") {
        const x = left;
        let y = doc.y;
        const rowH = 20;

        doc.fontSize(12).font("Helvetica-Bold");
        let blockHeight =
          10 +
          doc.heightOfString(`${f.fieldTitle}:`, {
            width: pageWidth - x - doc.page.margins.right,
          });

        if (f.fieldNote !== "null") {
          doc.fontSize(11).font("Helvetica");
          blockHeight +=
            15 +
            doc.heightOfString(f.fieldNote, {
              width: pageWidth - x - doc.page.margins.right,
            }) +
            rowH;
        } else {
          blockHeight += rowH;
        }

        const options = f.options;
        options.forEach((o) => {
          blockHeight += rowH;
          if (o.optionNote !== "null") {
            const noteWidth = pageWidth - (x + 6 + 6) - doc.page.margins.right;
            doc.fontSize(11).font("Helvetica");
            blockHeight +=
              doc.heightOfString(o.optionNote, { width: noteWidth }) + 4;
          }
        });

        if (y + blockHeight > pageBottom()) {
          doc.addPage();
          y = doc.page.margins.top;
        }

        y += 10;
        doc.fontSize(12).font("Helvetica-Bold").text(`${f.fieldTitle}:`, x, y);

        if (f.fieldNote !== "null") {
          doc.x = x;
          doc.y = y + 15;
          doc
            .fontSize(11)
            .font("Helvetica")
            .text(f.fieldNote, x, doc.y, {
              width: pageWidth - x - doc.page.margins.right,
            });
        }
        y = doc.y + rowH;

        options.forEach((o) => {
          if (
            compiledForm[s.sectionTitle][f.fieldTitle].includes(o.optionName)
          ) {
            doc.rect(x, y, 6, 6).fill("black");
            doc.fillColor("black");
          } else {
            doc.rect(x, y, 6, 6).stroke();
          }

          doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text(`${o.optionName}`, x + 6 + 6, y - 1);
          y += rowH;

          if (o.optionNote !== "null") {
            const noteWidth = pageWidth - (x + 6 + 6) - doc.page.margins.right;
            doc.fontSize(11).font("Helvetica");
            const noteHeight = doc.heightOfString(o.optionNote, {
              width: noteWidth,
            });
            doc.text(o.optionNote, x + 6 + 6, y - 10, { width: noteWidth });
            y += noteHeight + 4;
          }
        });

        doc.x = x;
        doc.y = y;

        // il prossimo campo text riparte da una nuova riga
        lastEndX = null;
        rowTop = null;
        rowHeight = 0;
      }
    });
  });
  const y = doc.y + 20;
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`Data ${new Date().toLocaleDateString("it-IT")}`, doc.x, y, {
      align: "right",
    });
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Firma del legale rappresentante:", doc.x, y, { align: "left" });
  doc
    .moveTo(doc.page.margins.left, y + 40)
    .lineTo(doc.page.margins.left + 200, y + 40)
    .stroke();
  doc.end();
}
