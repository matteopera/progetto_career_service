import { fi } from "zod/v4/locales"

export default async function getPDF(id:string){
    const res=await fetch(`/api/aziende/pdf/${id}`)

    if (res.ok){
        const blob=await res.blob()
    console.log(res.status,blob.size, blob.type)
    const url=window.URL.createObjectURL(blob)

    const link=document.createElement("a")

    link.href=url

    link.download="PDF_Iscrizione.pdf"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
    }

    return res

}


export async function saveCompiledPDF(file:File){
    const formData=new FormData()

    formData.append("file",file)

    await fetch("/api/aziende/upload/pdf", {
        method:"POST",
        headers:{
            "Content-Type":"application/pdf"
        },
        body:file
    })

}