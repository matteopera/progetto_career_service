import axios from "axios"
import { fi } from "zod/v4/locales"

export default async function getPDF(id:string){
    const res=await axios.get(`/api/aziende/pdf/${id}`,{responseType:"blob"})

    const blob=res.data
    const url=window.URL.createObjectURL(blob)

    const link=document.createElement("a")

    link.href=url

    link.download="PDF_Iscrizione.pdf"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)

    return res

}


export async function saveCompiledPDF(file:File,id:string){
    const formData=new FormData()
    formData.append("file",file)
    formData.append("fileName",id)
    const res=await axios.post("/api/aziende/upload/pdf",formData)

    return res

}