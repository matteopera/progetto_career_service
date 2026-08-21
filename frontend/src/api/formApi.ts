
import { zodContentForm } from "@/types/formType"
import z from "zod"

/**
 * The function makes a validation of the form sent from the server and return it
 * @returns the form for the companies
 */
export default async function fetchForm(){
    try{
        const response=await fetch("http://127.0.0.1:8000/form")

        if(!response.ok){
            console.error("Error during the fetching of the form")
        }

        const formJson=await response.json()

        //parsing of the form
        const parsedForm=await zodContentForm.parseAsync(formJson)

        return parsedForm

    }catch(error){
        if(error instanceof z.ZodError){
            console.error("The form type is not valid")
        }
        else{
            console.error("Error during the acquiring of the form")
        }
        return null
    }
}