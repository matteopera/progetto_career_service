import { findFormByStatus } from "../../db/form.js";
import z from "zod"
import { zodForm } from "../../types/form.js";
export async function findOnlineForm(){
    //db query
    const form=await findFormByStatus("online")
    
    //check of the form's structure with zod
    const parsedForm=zodForm.parse(form)
    
    //extracting contentForm from parsedForm
    const contentForm=parsedForm.content

    return contentForm
}

export async function insertForm(){
    
}