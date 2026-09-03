import { ObjectId } from "mongodb";
import { contentFormTest } from "../test-form/test.js";
import { compiledForm, form } from "../types/form.js";
import { db } from "./db.js";

// TODO: sarà da passare il form
export async function createForm() {
  //apertura della collezione
  const collection = db.collection("forms");

  let form: form = {
    content: contentFormTest,
    title: "Form Ottobre",
    created: new Date(),
    lastEdit: new Date(),
    note: "Note interne",
    status: "draft",
  };

  const res = await collection.insertOne(form);

  //restituzione del form
}

export async function findFormsAsync() {
  //apertura della collezione
  const collection = db.collection("forms");
  const res = await collection.find({}).toArray();

  return res;
}


export async function findFormByStatus(state:string){
  const collection=db.collection("form");
  const res=await collection.findOne({status:state})
  return res
}


export async function insertNewCompiledForm(compileForm:compiledForm){
  const collection=db.collection("compiledForm")
  const res=await collection.insertOne(compileForm)
  return res.insertedId
}



export async function findCompiledFormById(id:string){
  const collection=db.collection("compiledForm")
  const res=await collection.findOne({_id:new ObjectId(id)})

  return res
}
