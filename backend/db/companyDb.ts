import { ObjectId } from "mongodb";
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

  let form = await collection.findOne({
    formTitle: "MODULO DI ADESIONE A RECRUITING DAY VERONA VICENZA 2025",
  });

  //restituzione del form
  return { ...form, _id: form?._id.toString() };
}

export async function findRegisteredCompanies(formId: string) {
  const collection = db.collection("compiledForm");

  const companies = await collection.find({}).toArray();

  return companies;
}

export async function findRegisteredCompaniesByFormId(formId: string) {
  const collection = db.collection("compiledForm");

  const companies = await collection
    .find({ info: { idOnlineForm: new ObjectId(formId) } })
    .toArray();

  return companies;
}

export async function findLastRegisteredCompanies() {
  const collection = db.collection("compiledForm");

  const companies = await collection
    .aggregate([
      { $sort: { _id: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "form",
          localField: "info.idOnlineForm",
          foreignField: "_id",
          as: "formStructure",
        },
      },
      {
        $unwind: {
          path: "$formStructure",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    .toArray();

  console.log(companies);

  return companies;
}
