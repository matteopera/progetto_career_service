import { db } from "./db.js";

export async function findFaq() {
  //apertura della collezione
  const faqCollection = db.collection("FAQ");

  const res = await faqCollection.find().toArray(); //query di tutte le FAQ
  const mappedRes = res.map((r) => ({
    //modifica dell'object id in una stringa
    ...r,
    _id: r._id.toString(),
  }));
  return mappedRes;
}

export async function formRequest() {
  //apertura della collezione
  const collection = db.collection("form");

  //ricerca del form corretto

  //per ora il form è solo uno ma si potrà ricercare per nome

  let form = await collection.findOne({ nome: "OTTOBRE2025" });

  //restituzione del form
  return { ...form, _id: form?._id.toString() };
}
