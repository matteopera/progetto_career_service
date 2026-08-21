import * as z from "zod";

//Modello delle FAQ
export const FAQ = z.object({
  _id: z.string(),
  domanda: z.string(),
  risposta: z.string(),
});

export const FAQs = z.array(FAQ);

//modelli del form
export const textFieldZod = z.object({
  nome: z.string(),
  tipo: z.literal("text"),
  placeolder: z.string(),
});

export const selection = z.object({
  //viene condiviso dalla selezione e la selezione multipla
  nome: z.string(),
  nota: z.string(),
});
export const selectionField = z.object({
  nome: z.string(),
  nota: z.string(),
  tipo: z.literal("selezione"),
  selezioni: z.array(selection),
});
export const multipleSelectionField = z.object({
  nome: z.string(),
  nota: z.string(),
  tipo: z.literal("selezione-multipla"),
  selezioni: z.array(selection),
});

export const section = z.object({
  titolo: z.string(),
  nota: z.string(),
  campi: z.array(
    z.union([textFieldZod, selectionField, multipleSelectionField]),
  ),
});
export const formTypeZod = z.object({
  _id: z.string(),
  nome: z.string(),
  sezioni: z.array(section),
});

export type formType = z.infer<typeof formTypeZod>;
export type textField = z.infer<typeof textFieldZod>;
