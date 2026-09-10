import { ObjectId } from "mongodb";
import { contentFormTest } from "../test-form/test.js";
import { compiledForm, contentForm, form } from "../types/form.js";
import { db } from "./db.js";

export async function findFormsAsync() {
  //apertura della collezione
  const collection = db.collection("form");
  const res = await collection.find({}).toArray();

  return res;
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

// Funzione richiamata da admin per creazione nuovo form
export async function insertNewForm(form: Omit<form, "_id">) {
  const collection = db.collection("form");
  const res = await collection.insertOne(form);
  return res.insertedId;
}
