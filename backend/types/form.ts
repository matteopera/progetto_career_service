//form type with zod library
import z from "zod";
import { ObjectId } from "mongodb";
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
  _id: z.instanceof(ObjectId),
  content: zodContentForm,
  title: z.string(),
  note: z.string(),
  created: z.date(),
  lastEdit: z.date(),
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

export const zodCompiledForm = z.record(
  z.string(),
  z.record(z.string(), z.union([z.string(), z.array(z.string()),z.instanceof(ObjectId)])),
);

export type compiledForm = z.infer<typeof zodCompiledForm>;

// export type form = {
//   //form
//   content: contentForm;
//   title: string;
//   note: string;
//   created: Date;
//   lastEdit: Date;
//   status: statusForm;
// };

// export type statusForm = "draft" | "online" | "offline";

// export type contentForm = {
//   //form
//   formTitle: string;
//   formSubtitle: string;
//   formNote: string;
//   sections: section[];
//   date: string; //sostituibile dalla generazione automatica nel pdf
// };

// type section = {
//   sectionTitle: string;
//   sectionNote: string;
//   fields: field[];
// };

// type textField = {
//   fieldTitle: string;
//   fieldType: "text";
//   fieldNote: string;
//   textType: textType;
// };

// type checkboxField = {
//   fieldTitle: string;
//   fieldType: "check";
//   fieldNote: string;
//   options: option[];
// };

// type radioField = {
//   fieldTitle: string;
//   fieldType: "radio";
//   fieldNote: string;
//   options: option[];
// };

// type option = {
//   optionName: string;
//   optionNote: string;
// };

// type field = textField | checkboxField | radioField;

// type textType = "text" | "email" | "tel" | "CF" | "P.IVA";
