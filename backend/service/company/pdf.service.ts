import { Response } from "express";
import PDFDocument from "pdfkit";
import { compiledForm, contentForm } from "../../types/form.js";
import { loadEnvFile } from "node:process";
import { findCompiledForm, findOnlineForm } from "./form.service.js";
export default async function generateInscriptionPdf(
  res: Response,
  idCompiledForm:string,
) {
    //fetching compiledForm
    const {contentForm}=await findOnlineForm()

    //fetching compiledForm by id
    const compiledForm:compiledForm=await findCompiledForm(idCompiledForm)
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

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(contentForm.formNote, { align: "center" });

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

    let lastEndX: number | null = null;
    let lastY: number | null = null;
    s.fields.forEach((f, index) => {
      if (f.fieldType === "text") {
        if (f.fieldNote !== "null") {
          doc.fontSize(11).font("Helvetica").text(f.fieldNote);
        }

        const titleText = `${f.fieldTitle}:    `;
        const valueText = `${compiledForm[`${s.sectionTitle}`][`${f.fieldTitle}`]}`;

        doc.fontSize(12).font("Helvetica-Bold");
        const titleWidth = doc.widthOfString(titleText);

        doc.fontSize(12).font("Helvetica");
        const valueWidth = doc.widthOfString(valueText);

        const textWidth = titleWidth + valueWidth;
        const gap = 30;

        let x: number;
        let y: number;

        if (
          lastEndX != null &&
          lastY != null &&
          textWidth + gap + lastEndX < pageWidth
        ) {
          //si va dritto
          x = lastEndX + gap;
          y = lastY;
          lastEndX += textWidth + gap;
        } else {
          //si va a capo
          x = doc.page.margins.left;
          y = lastY !== null ? lastY + 20 : doc.y;
          lastEndX = doc.page.margins.left + textWidth;
          lastY = y;
        }

        doc
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(titleText, x, y, { lineBreak: false });
        doc
          .fontSize(12)
          .font("Helvetica")
          .text(valueText, x + titleWidth, y, { lineBreak: false });

        doc.x = doc.page.margins.left;
        doc.y = lastY! + 20;
      }
      const x = doc.page.margins.left;
      let y = doc.y;
      const rowHeight = 20;
      const pageBottom = doc.page.height - doc.page.margins.bottom;
      if (f.fieldType === "check" || f.fieldType === "radio") {
        const pageBottom = doc.page.height - doc.page.margins.bottom;
        const rowH = rowHeight;

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

        if (y + blockHeight > pageBottom) {
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
