import { json } from "express";
import { BSON } from "mongodb";
import { findRegisteredCompanies, findRegisteredCompaniesByFormId } from "../db/companyDb.js";
import * as XLSX from "xlsx";
import { findOnlineForm } from "./company/form.service.js";
import { findCompiledFormByInfo, findFormAsync } from "../db/formDb.js";
import {form, zodForm } from "../types/form.js";
export default async function generateCompaniesExcel(idForm:string) {
  //generazione del formato di excel a partire da un sample di azienda
  const f=await findFormAsync(idForm)
  
  if(!f){
    //non ha trovato il form relativo
    console.log(idForm)
    throw new Error("form non trovato")
  }
  //parsing con zod
  const parsedF=zodForm.parse(f)

  const contentForm=parsedF.content
  //si parte dal tipo un tipo di form compialto e si segue quella tipologia
  //const { contentForm, idForm } = await findOnlineForm();
  //richiesta di tutte le iscrizioni per quel form
  const worksheet = XLSX.utils.aoa_to_sheet([[]]);
  const data = await findRegisteredCompaniesByFormId(parsedF._id.toString());

  if(data.length==0){
    //array vuoto nessuna informazione da mettere nel file excel
    throw new Error("Nessuna azienda legata al form richiesto")
  }
  const sections: (string | null)[] = [];
  const fields: string[] = [];
  const merge: XLSX.Range[] = [];
  let colStart = 0;

  contentForm.sections.forEach((s) => {
    const fieldCount = s.fields.length;
    if (fieldCount === 0) return;


    sections.push(s.sectionTitle);

    for (let i = 1; i < fieldCount; i++) {
      sections.push(null);
    }

    s.fields.forEach((f) => {
      fields.push(f.fieldTitle);
    });

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
