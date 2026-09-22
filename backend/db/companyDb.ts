import { ObjectId } from "mongodb";
import { db } from "./db.js";

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

  return companies;
}
