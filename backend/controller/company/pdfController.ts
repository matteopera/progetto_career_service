import { Request,Response } from "express"
import generateInscriptionPdf from "../../service/company/pdf.service.js"
import { findOnlineForm } from "../../service/company/form.service.js"
import { compiledForm, contentForm } from "../../types/form.js"
export default async function getPdf(req:Request, res:Response){
    const contentForm:contentForm=await findOnlineForm()
    const compiledForm:compiledForm={
  'Informazioni dell\'azienda': {
    'nome/denominazione/ragione sociale dell\'AZIENDA': 'Azienda di Prova Srl',
    'sede legale in': 'Africa',
    CF: 'DKFLSI93B48J386M',
    'P.IVA': '12345678910'
  },
  Partecipazione: {
    'L\'azienda richiede di partecipare': 'ONLINE+IN PRESENZA CON DESK AZIENDALE',
    'Giornate di partecipazione': [
      'mercoledì 22 ottobre (ore 9.30 - 16.30)',
    ],
    'n. posizioni da coprire': [

      'giuridica',
      'scientifica'
    ],
    'n. posizioni per cat. protette': [
      'umanistica',
      'economica',
    ]
  },
  'Contatti referente aziendale': {
    'nome e cognome': 'Manuel Gasparini',
    'ruolo aziendale': 'Inserviente',
    email: 'manugasparini04@gmail.com',
    'tel. diretto': '+39 3334212221'
  },
  'Indirizzo email per la gestione del profilo aziendale': {
    email: 'manugasparini04@gmail.com'
  }
}
    generateInscriptionPdf(res,contentForm,compiledForm)
    return res.status(200)
}