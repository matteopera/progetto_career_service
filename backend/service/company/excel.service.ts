import { json } from "express";
import { BSON } from "mongodb";
import { findRegisteredCompanies } from "../../db/companyDb.js";
import * as XLSX from "xlsx";
import { findOnlineForm } from "./form.service.js";
import { findCompiledFormByInfo } from "../../db/formDb.js";
import { contentForm } from "../../types/form.js";
export default async function generateCompaniesExcel() {
  const companies = await findRegisteredCompanies();
  //generazione del formato di excel a partire da un sample di azienda

  //si parte dal tipo un tipo di form compialto e si segue quella tipologia
  const { contentForm, idForm } = await findOnlineForm();

  //richiesta di tutte le iscrizioni per quel form
  const worksheet = XLSX.utils.aoa_to_sheet([[]]);
  const data = await findCompiledFormByInfo(idForm);

  const sections: (string | null)[] = [];
  const fields: string[] = [];
  const merge: XLSX.Range[] = [];
  let colStart = 0;

  contentForm.sections.forEach((s) => {
    const fieldCount = s.fields.length;
    if (fieldCount === 0) return;

    // 1. Inserisci il titolo della sezione solo nella prima colonna utile
    sections.push(s.sectionTitle);

    // 2. Riempi le colonne successive con null per allineare l'array ai campi sottostanti
    for (let i = 1; i < fieldCount; i++) {
      sections.push(null);
    }

    // 3. Aggiungi i campi
    s.fields.forEach((f) => {
      fields.push(f.fieldTitle);
    });

    // 4. Merge sulla riga 0 (Riga 1 di Excel) se la sezione ha più di 1 campo
    if (fieldCount > 1) {
      merge.push({
        s: { r: 0, c: colStart },
        e: { r: 0, c: colStart + fieldCount - 1 },
      });
    }

    colStart += fieldCount;
  });

  XLSX.utils.sheet_add_aoa(worksheet, [sections], { origin: "A1" });
  XLSX.utils.sheet_add_aoa(worksheet, [fields], { origin: "A2" });
  worksheet["!merges"] = merge;
  console.log(sections);
  //inserimento intestazione nomi campi
  contentForm;
  //inserimento valori
  data.forEach((d, index) => {
    const entry: string[] = [];
    contentForm.sections.forEach((s) => {
      s.fields.forEach((f) => {
        if (f.fieldType === "text" || f.fieldType === "radio") {
          entry.push(d[s.sectionTitle][f.fieldTitle]);
        } else {
          //è un checkbox
          const value = `${d[s.sectionTitle][f.fieldTitle]}`.replaceAll(
            ",",
            ", ",
          );
          entry.push(value);
        }
      });
    });
    XLSX.utils.sheet_add_aoa(worksheet, [entry], { origin: `A${index + 3}` });
  });
  // const jsonFormat = EJSON.stringify(companies[0]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}
