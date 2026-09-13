import { json } from "express";
import { BSON } from "mongodb";
import { findRegisteredCompanies } from "../../db/companyDb.js";
import * as XLSX from "xlsx";
export default async function generateCompaniesExcel() {
  const companies = await findRegisteredCompanies();
  //generazione del formato di excel a partire da un sample di azienda
  const EJSON = BSON.EJSON;

  const jsonFormat = EJSON.stringify(companies[0]);
  const worksheet = XLSX.utils.json_to_sheet(companies);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}
