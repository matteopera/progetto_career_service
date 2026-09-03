import { findCompiledFormById, findFormByStatus, insertForm, insertNewCompiledForm } from "../../db/form.js";
import z from "zod";
import { compiledForm, zodCompiledForm, zodForm } from "../../types/form.js";
import { error } from "node:console";
export async function findOnlineForm() {
  //db query
  const form = await findFormByStatus("online");

  //check of the form's structure with zod
  const parsedForm = zodForm.parse(form);

  //extracting contentForm from parsedForm
  const contentForm = parsedForm.content;

  return contentForm;
}

export async function insertCompiledForm(compiledForm: compiledForm) {
  //check over the form field
  const onlineForm = await findOnlineForm();
  const compiledFormkeys = Object.keys(compiledForm);
  const onlineFormKeys=onlineForm.sections.map((s)=>s.sectionTitle)
  const invalidKeys = compiledFormkeys.filter(
    (k) => !onlineFormKeys.includes(k),
  );
  const checked: boolean = invalidKeys.length === 0;

  if (checked) {
    //upload into db
    const res = await insertNewCompiledForm(compiledForm);
    return res
  } else {
    //error handling
    throw new Error("given form is not valid")
    
  }
}


export async function findCompiledForm(id:string){
  const compiledFormWithId=await findCompiledFormById(id)
  //removing id from the compiled form
  const {_id,...compiledForm}=compiledFormWithId

  //compiled form parsing
  const parsedCompiledForm=zodCompiledForm.parse(compiledForm)
  return parsedCompiledForm
}
