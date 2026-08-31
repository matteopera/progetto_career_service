import { Response } from "express";
import PDFDocument from "pdfkit"
import { compiledForm, contentForm } from "../../types/form.js";
import { loadEnvFile } from "node:process";
export default function generateInscriptionPdf(res:Response, contentForm:contentForm,compiledForm:compiledForm){
    const doc=new PDFDocument();

    doc.pipe(res);

    doc.image("public/logo_univr.png", 20, 20, { width: 150 });
    doc.fontSize(12).font("Helvetica-Bold").text(contentForm.formTitle,{align:"center"})
    doc.fontSize(12).font("Helvetica").text(contentForm.formSubtitle,{align:"center"})

    doc.fontSize(12).font("Helvetica").text(contentForm.formNote,{align:"center"})

    contentForm.sections.forEach((s)=>{
        doc.y=doc.y+20
        doc.fontSize(12).font("Helvetica-Bold").text(s.sectionTitle,{align:"left", paragraphGap:6})
        if(s.sectionNote!=="null"){ doc.fontSize(11).font("Helvetica").text(s.sectionNote,{align:"left", paragraphGap:6})}

        s.fields.forEach((f)=>{
            if(f.fieldType==="text" || f.fieldType==="radio"){
            doc.fontSize(12).font("Helvetica").text(`${f.fieldTitle}:    ${compiledForm[`${s.sectionTitle}`][`${f.fieldTitle}`]}`,{paragraphGap:3})
            }
            const x=doc.page.margins.left
            let y=doc.y
            const rowHeight=20
            if(f.fieldType==="check"){
                y+=10
                doc.fontSize(12).font("Helvetica").text(`${f.fieldTitle}:`,x,y)
                y+=rowHeight
                const options=f.options
                options.forEach((o)=>{
                    if(compiledForm[s.sectionTitle][f.fieldTitle].includes(o.optionName)){
                        doc.rect(x,y,6,6).fill("black")
                    }
                    else{
                        doc.rect(x,y,6,6).stroke()
                    }
                    doc.fontSize(12).font("Helvetica").text(`${o.optionName}`, x + 6 + 6, y - 1)
                    y+=rowHeight
                })
                doc.x=x
            }
        })
        
    })
    const y=doc.y+20
    doc.fontSize(12).font("Helvetica-Bold").text(`Data ${new Date().toLocaleDateString('it-IT')}`,doc.x,y,{align:"right"})
    doc.fontSize(12).font("Helvetica-Bold").text("Firma del legale rappresentante:",doc.x,y,{align:"left"})
    doc.moveTo(doc.page.margins.left,y+40).lineTo(doc.page.margins.left+200,y+40).stroke()
    doc.end();
}