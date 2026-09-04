
export default async function getPDF(id:string){
    const res=await fetch(`/api/aziende/pdf/${id}`)

    if(!res.ok){
        throw new Error("Errore nel download del pdf")
    }

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