import { MongoError } from "mongodb";

export type DBError = [httpCode: number, message: string];
export function handleDBError(error: MongoError) {
  switch (error.code) {
    case 11000:
      console.error("Duplicato: Documento già esistente");
      return <DBError>[409, "Elemento già esistente"];
    case 121:
      console.error("Documento non valido per lo schema");
      return <DBError>[400, "Schema non valido"];
    default:
      console.error("Errore MongoDB");
      return <DBError>[500, "Errore del database"];
  }
}
