//form type with zod library
import z from "zod";

export const zodOption = z.object({
  optionName: z.string(),
  optionNote: z.string(),
});
export const zodCheckboxField = z.object({
  fieldTitle: z.string(),
  fieldType: z.literal("check"),
  fieldNote: z.string(),
  options: z.array(zodOption),
});

export const zodRadioField = z.object({
  fieldTitle: z.string(),
  fieldType: z.literal("radio"),
  fieldNote: z.string(),
  options: z.array(zodOption),
});

export const zodTextType = z.enum(["text", "email", "tel", "CF", "P.IVA"]);

export const zodTextField = z.object({
  fieldTitle: z.string(),
  fieldType: z.literal("text"),
  fieldNote: z.string(),
  textType: zodTextType,
});

export const zodField = z.discriminatedUnion("fieldType", [
  zodTextField,
  zodCheckboxField,
  zodRadioField,
]);

export const zodSection = z.object({
  sectionTitle: z.string(),
  sectionNote: z.string(),
  fields: z.array(zodField),
});

export const zodContentForm = z.object({
  formTitle: z.string(),
  formSubtitle: z.string(),
  formNote: z.string(),
  sections: z.array(zodSection),
});

export const zodStatusForm = z.enum(["draft", "online", "offline"]);

export const zodForm = z.object({
  _id: z.string(),
  content: zodContentForm,
  title: z.string(),
  note: z.string(),
  created: z.coerce.date(),
  lastEdit: z.coerce.date(),
  status: zodStatusForm,
});

//inference of zod's types
export type option = z.infer<typeof zodOption>;

export type checkboxField = z.infer<typeof zodCheckboxField>;

export type textField = z.infer<typeof zodTextField>;

export type radioField = z.infer<typeof zodRadioField>;

export type textType = z.infer<typeof zodTextType>;

export type field = z.infer<typeof zodField>;

export type section = z.infer<typeof zodSection>;

export type contentForm = z.infer<typeof zodContentForm>;

export type statusForm = z.infer<typeof zodStatusForm>;

export type form = z.infer<typeof zodForm>;

//Regex
const phoneRegex = /^(\+39\s?)?3\d{2}\s?\d{6,7}$/;
const codiceFiscaleRegex = /^[A-Z]{6}\d{2}[A-EHLMPR-T]\d{2}([A-Z]\d{3})[A-Z]$/i;
const partitaIvaRegex = /^\d{11}$/;

//zod types for textField validation
export const zodEmail = z.email();
export const zodTel = z.string().regex(phoneRegex);
export const zodPIVA = z.string().regex(partitaIvaRegex);
export const zodCodiceFiscale = z.string().regex(codiceFiscaleRegex);

export type emailType = z.infer<typeof zodEmail>;
export type telType = z.infer<typeof zodTel>;
export type pivaType = z.infer<typeof zodPIVA>;
export type CF = z.infer<typeof zodCodiceFiscale>;
