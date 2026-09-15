import type { value } from "@/hooks/useFetchForm";
import { zodContentForm } from "@/types/formType";
import z from "zod";
import axios from "axios";
/**
 * The function makes a validation of the form sent from the server and return it
 * @returns the form for the companies
 */
export default async function fetchForm(formId:string|null) {
  const response = await axios.get(formId!==null? `/api/aziende/form/${formId}`:"/api/aziende/form");

  const formJson = await response.data;

  //parsing of the form
  const parsedForm = await zodContentForm.parseAsync(formJson);

  return parsedForm;
}

export async function uploadCompiledForm(compiledForm: value) {

    const response=await axios.post("/api/aziende/uploadForm", compiledForm)

  const result = await response.data;

  const id = result._id;

  return id;
}
