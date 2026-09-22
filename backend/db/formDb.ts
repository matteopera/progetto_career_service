import { ObjectId } from "mongodb";
import { compiledForm, contentForm, form } from "../types/form.js";
import { db } from "./db.js";

export async function findFormsAsync() {
  //apertura della collezione
  const collection = db.collection("form");
  const res = await collection.find({}).sort({ lastEdit: -1 }).toArray();

  return res;
}

export async function findLastFormsAsync() {
  //apertura della collezione
  const collection = db.collection("form");
  const res = await collection
    .find({})
    .sort({ lastEdit: -1 })
    .limit(5)
    .toArray();

  return res;
}

export async function findFormAsync(idForm: string) {
  //apertura della collezione
  const collection = db.collection("form");
  const res = await collection.findOne({ _id: new ObjectId(idForm) });

  return res;
}

//deleteFormAsync.
export async function deleteFormById(idForm: string) {
  //apertura della collezione
  const collection = db.collection("form");
  const res = await collection.deleteOne({ _id: new ObjectId(idForm) });

  return res.deletedCount;
}

export async function findFormByStatus(state: string) {
  const collection = db.collection("form");
  const res = await collection.findOne({ status: state });
  return res;
}

export async function insertNewCompiledForm(compileForm: compiledForm) {
  const collection = db.collection("compiledForm");
  const res = await collection.insertOne(compileForm);
  return res.insertedId;
}

export async function findCompiledFormById(id: string) {
  const collection = db.collection("compiledForm");
  const res = await collection.findOne({ _id: new ObjectId(id) });

  return res;
}

export async function findCompiledFormByInfo(id: string) {
  const collection = db.collection("compiledForm");
  const res = await collection
    .find({ "info.idOnlineForm": new ObjectId(id) })
    .toArray();

  return res;
}

// Funzione richiamata da admin per creazione nuovo form
export async function insertNewForm(form: Omit<form, "_id">) {
  const collection = db.collection("form");
  const res = await collection.insertOne(form);
  return res.insertedId ? 1 : 0;
}

export async function updateFormsToDraft() {
  const collection = db.collection("form");
  const res = await collection.updateMany({}, { $set: { status: "draft" } });
  return res.acknowledged;
}

export async function updateFormAsync(form: Omit<form, "_id">, idForm: string) {
  const { created, ...formFinal } = form;
  const collection = db.collection("form");
  const res = await collection.updateOne(
    { _id: new ObjectId(idForm) },
    { $set: formFinal },
  );
  return res.modifiedCount;
}

export async function getDataCardAsync() {
  const collectionForm = db.collection("form");
  const collectionCompiledForm = db.collection("compiledForm");

  const res = {
    nrForm: await collectionForm.countDocuments(),
    nrCompiledForm: await collectionCompiledForm.countDocuments(),
    lastCreatedForm: await collectionForm.findOne(
      {},
      { sort: { created: -1 }, projection: { created: 1, _id: 1 } },
    ),
    nrCompiledFormLastEvent: await collectionCompiledForm.countDocuments({
      "info.idOnlineForm": (
        await collectionForm.findOne(
          { status: "online" },
          { projection: { _id: 1 } },
        )
      )?._id,
    }),
  };

  return res;
}
