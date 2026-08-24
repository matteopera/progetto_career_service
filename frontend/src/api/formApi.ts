import type { value } from "@/hooks/useFetchForm"
import { zodContentForm } from "@/types/formType"
import z from "zod"

/**
 * The function makes a validation of the form sent from the server and return it
 * @returns the form for the companies
 */
export default async function fetchForm(){
        const response=await fetch("/api/aziende/form")

        if(!response.ok){
            console.error("Error during the fetching of the form")
        }

        const formJson=await response.json()

        //parsing of the form
        const parsedForm=await zodContentForm.parseAsync(formJson)
        
        return parsedForm
}

export async function uploadCompiledForm(compiledForm:value){
    const response=await fetch("/api/aziende/uploadForm",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(compiledForm)
    })

    //da migliorare la gestione degli errori
    if(!response.ok){
        console.error("Errore nel caricamento del form")
    }
}