import fetchForm from "@/api/formApi";
import type { contentForm } from "@/types/formType";
import { useEffect, useState } from "react";

type useFetchFormType={
    form:contentForm|null,
    isLoading:boolean,
    error:Error|null
}
export default function useFetchForm():useFetchFormType{
    const [form, setForm]=useState<contentForm|null>(null)

    const [isLoading,setIsLoading]=useState<boolean>(true)

    const [error,setError]=useState<Error|null>(null)

    useEffect(()=>{
        //fetchign form from DB
        fetchForm().then((data)=>{
            setForm(data)
        }).catch((err)=>{
            setError(err)
            console.error(err)
        }).finally(()=>{
            setIsLoading(false)
        })
    },[])

    return {form,isLoading,error}
}