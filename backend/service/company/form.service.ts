import {
  findCompiledFormById,
  findFormAsync,
  findFormByStatus,
  insertForm,
  insertNewCompiledForm,
} from "../../db/formDb.js";
import z from "zod";
import { compiledForm, zodCompiledForm, zodForm } from "../../types/form.js";
import { ObjectId } from "mongodb";
export async function findOnlineForm() {
  //db query
  const form = await findFormByStatus("online");

  //check of the form's structure with zod
  const parsedForm = zodForm.parse(form);

  const idForm = parsedForm._id.toString();
  //extracting contentForm from parsedForm
  const contentForm = parsedForm.content;

  return { contentForm, idForm };
}

export async function insertCompiledForm(compiledForm: compiledForm) {
  //check over the form field
  const { contentForm, idForm } = await findOnlineForm();
  const compiledFormkeys = Object.keys(compiledForm);
  const onlineFormKeys = contentForm.sections.map((s) => s.sectionTitle);
  const invalidKeys = compiledFormkeys.filter(
    (k) => !onlineFormKeys.includes(k),
  );
  const checked: boolean = invalidKeys.length === 0;

  if (checked) {
    //upload into db
    compiledForm["info"] = { idOnlineForm: new ObjectId(idForm) };
    const res = await insertNewCompiledForm(compiledForm);
    return res;
  } else {
    //error handling
    throw new Error("given form is not valid");
  }
}

export async function findCompiledForm(id: string) {
  const compiledFormWithId = await findCompiledFormById(id);
  //removing id from the compiled form
  const { _id, ...compiledForm } = compiledFormWithId;

  //compiled form parsing
  const parsedCompiledForm = zodCompiledForm.parse(compiledForm);
  return parsedCompiledForm;
}

export async function findFormById(id: string) {
  const form = await findFormAsync(id);

  const parsedForm = zodForm.parse(form);
  const content = parsedForm.content;
  return content;
}
