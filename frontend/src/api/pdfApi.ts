import { methods } from "better-auth/react";

export default async function getPDF(id:string){
    const res=await fetch(`api/aziende/pdf/${id}`)
}