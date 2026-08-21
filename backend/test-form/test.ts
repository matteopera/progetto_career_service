import { contentForm } from "../types/form.js";

export const contentFormTest: contentForm = {
  formTitle: "MODULO DI ADESIONE A RECRUITING DAY VERONA VICENZA 2025",
  formSubtitle: "IN PRESENZA (22-23-24 OTTOBRE) e ONLINE DAL 27 OTTOBRE 2025",
  formNote:
    "ATTENZIONE: da restituire firmato all’indirizzo eventiplacement@ateneo.univr.it entro il giorno 24 settembre 2025",
  sections: [
    {
      sectionTitle: "Informazioni dell'azienda",
      sectionNote: "null",
      fields: [
        {
          fieldTitle: "nome/denominazione/ragione sociale dell'AZIENDA",
          fieldType: "text",
          fieldNote: "null",
          textType: "text",
        },
        {
          fieldTitle: "sede legale in",
          fieldType: "text",
          fieldNote: "null",
          textType: "text",
        },
        {
          fieldTitle: "CF",
          fieldType: "text",
          fieldNote: "null",
          textType: "CF",
        },
        {
          fieldTitle: "P.IVA",
          fieldType: "text",
          fieldNote: "null",
          textType: "P.IVA",
        },
      ],
    },
    {
      sectionTitle: "Partecipazione",
      sectionNote: "NOTA SUL DESK",
      fields: [
        {
          fieldTitle: "L'azienda richiede di partecipare",
          fieldType: "radio",
          fieldNote: "null",
          options: [
            {
              optionName: "SOLO ONLINE",
              optionNote: "con profilo aziendale sul portale",
            },
            {
              optionName: "ONLINE+IN PRESENZA CON DESK AZIENDALE",
              optionNote:
                "tavolo 160x80, 3 sedie, personalizzazione a carico dell'azienda",
            },
          ],
        },
        {
          fieldTitle: "Giornate di partecipazione",
          fieldType: "check",
          fieldNote:
            "L'evento si svolge presso il Polo Santa Marta il 22, 23, 24 ottobre, l'azienda può candidarsi nelle seguenti date",
          options: [
            {
              optionName: "mercoledì 22 ottobre (ore 9.30 - 16.30)",
              optionNote: "null",
            },
            {
              optionName: "giovedì 23 ottobre (ore 9.30 - 16.30)",
              optionNote: "null",
            },
            {
              optionName: "venerdì 24 ottobre (ore 9.30 - 16.30)",
              optionNote: "null",
            },
          ],
        },
        {
          fieldTitle: "n. posizioni da coprire",
          fieldNote: "selezionare le voci corrispondenti",
          fieldType: "check",
          options: [
            {
              optionName: "umanistica",
              optionNote: "null",
            },
            {
              optionName: "economica",
              optionNote: "null",
            },
            {
              optionName: "giuridica",
              optionNote: "null",
            },
            {
              optionName: "scientifica",
              optionNote: "null",
            },
          ],
        },
        {
          fieldTitle: "n. posizioni per cat. protette",
          fieldNote: "selezionare le voci corrispondenti",
          fieldType: "check",
          options: [
            {
              optionName: "umanistica",
              optionNote: "null",
            },
            {
              optionName: "economica",
              optionNote: "null",
            },
            {
              optionName: "giuridica",
              optionNote: "null",
            },
            {
              optionName: "scientifica",
              optionNote: "null",
            },
          ],
        },
      ],
    },
    {
      sectionTitle: "Contatti referente aziendale",
      sectionNote: "null",
      fields: [
        {
          fieldTitle: "nome e cognome",
          fieldType: "text",
          fieldNote: "null",
          textType: "text",
        },
        {
          fieldTitle: "ruolo aziendale",
          fieldType: "text",
          fieldNote: "null",
          textType: "text",
        },
        {
          fieldTitle: "email",
          fieldType: "text",
          fieldNote: "null",
          textType: "email",
        },
        {
          fieldTitle: "tel. diretto",
          fieldType: "text",
          fieldNote: "null",
          textType: "tel",
        },
      ],
    },
    {
      sectionTitle: "Indirizzo email per la gestione del profilo aziendale",
      sectionNote: "null",
      fields: [
        {
          fieldTitle: "email",
          fieldType: "text",
          fieldNote: "Attenzione inserire un solo indirizzo mail",
          textType: "email",
        },
      ],
    },
  ],
  date: "Forse opzionale se aggiunta in automatico alla generazione del PDF",
};
