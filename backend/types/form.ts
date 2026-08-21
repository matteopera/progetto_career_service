export type form = {
  //form
  content: contentForm;
  title: string;
  note: string;
  created: Date;
  lastEdit: Date;
  status: statusForm;
};

export type statusForm = "draft" | "online" | "offline";

export type contentForm = {
  //form
  formTitle: string;
  formSubtitle: string;
  formNote: string;
  sections: section[];
  date: string; //sostituibile dalla generazione automatica nel pdf
};

type section = {
  sectionTitle: string;
  sectionNote: string;
  fields: field[];
};

type textField = {
  fieldTitle: string;
  fieldType: "text";
  fieldNote: string;
  textType: textType;
};

type checkboxField = {
  fieldTitle: string;
  fieldType: "check";
  fieldNote: string;
  options: option[];
};

type radioField = {
  fieldTitle: string;
  fieldType: "radio";
  fieldNote: string;
  options: option[];
};

type option = {
  optionName: string;
  optionNote: string;
};

type field = textField | checkboxField | radioField;

type textType = "text" | "email" | "tel" | "CF" | "P.IVA";
