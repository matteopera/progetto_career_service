type FAQ = {
  domanda: string;
  risposta: string;
};

type VersioneForm = {
  mese: number;
  anno: number;
};

type Generalita = {
  id: number;
  label: string;
  required: boolean;
};

type SceltaRadio = {
  nome: string;
  value: string;
  default: boolean;
};

type SceltaCheckbox = {
  nome: string;
  value: string;
};

type Attributo =
  | { type: "testo"; generalita: Generalita }
  | { type: "email"; generalita: Generalita }
  | { type: "numero"; generalita: Generalita }
  | { type: "telefono"; generalita: Generalita }
  | { type: "codFiscale"; generalita: Generalita }
  | { type: "partitaIva"; generalita: Generalita }
  | { type: "radio"; generalita: Generalita; scelte: SceltaRadio[] }
  | { type: "checkbox"; generalita: Generalita; scelte: SceltaCheckbox[] }
  | { type: "nota"; testo: string };

type Sezione = {
  nome: string;
  attributi: Attributo[];
};

export type FormTemplate = {
  titolo: string;
  versione: VersioneForm;
  sezioni: Sezione[];
};

const templateOttobre2025: FormTemplate = {
  titolo:
    "MODULO DI ADESIONE A RECRUITING DAY VERONA VICENZA 2025\nIN PRESENZA (22-23-24 OTTOBRE) e ONLINE DAL 27 OTTOBRE 2025",
  versione: { mese: 5, anno: 2026 },
  sezioni: [
    {
      nome: "Anagrafica Azienda",
      attributi: [
        {
          type: "testo",
          generalita: { label: "Nome dell'azienda", id: 1, required: true },
        },
        {
          type: "testo",
          generalita: { label: "sede legale in", id: 2, required: true },
        },
        {
          type: "testo",
          generalita: { label: "CF", id: 3, required: true },
        },
        {
          type: "testo",
          generalita: { label: "P. IVA", id: 4, required: true },
        },
      ],
    },
    {
      nome: "Richiesta partecipazione",
      attributi: [
        {
          type: "checkbox",
          generalita: {
            label: "L'azienda richiede di partecipare:",
            id: 4,
            required: true,
          },
          scelte: [
            {
              nome: "SOLO ONLINE con profilo aziendale sul portale di Recruiting Day Verona Vicenza (dal 27 ottobre al 15 novembre)",
              value: "online",
            },
            {
              nome: "ONLINE + IN PRESENZA* con DESK AZIENDALE",
              value: "online e presenza",
            },
          ],
        },
        {
          type: "testo",
          generalita: { label: "sede legale in", id: 2, required: true },
        },
        {
          type: "testo",
          generalita: { label: "CF", id: 3, required: true },
        },
        {
          type: "testo",
          generalita: { label: "P. IVA", id: 4, required: true },
        },
      ],
    },
  ],
};
