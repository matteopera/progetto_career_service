import { form } from "../types/form.js";

export function checkStructureForm(form: form) {
  const response = {
    success: true,
    message: "",
  };

  if (form.title === "") {
    response.message = "Il titolo del form interno è obbligatorio";
    response.success = false;
    return response;
  }

  if (
    form.content.sections.length == 0 ||
    form.content.sections.some((s) => s.fields.length == 0)
  ) {
    response.message =
      "Creare almeno una sezione e un campo. Ogni sezione deve avere almeno un campo";
    response.success = false;
    return response;
  }

  if (form.content.sections.some((s) => s.sectionTitle === "")) {
    response.message = "Le sezioni devono avere un titolo obbligatorio";
    response.success = false;
    return response;
  }

  if (
    form.content.sections
      .flatMap((s) => s.fields)
      .some((f) => f.fieldTitle === "")
  ) {
    response.message = "I campi devono avere un titolo obbligatorio";
    response.success = false;
    return response;
  }
  if (
    form.content.sections
      .flatMap((s) => s.fields)
      .filter((f) => f.fieldType === "check" || f.fieldType === "radio")
      .flatMap((f) => f.options)
      .some((o) => o.optionName === "")
  ) {
    response.message =
      "Le opzioni dei campi radio o checkbox devono avere un titolo obbligatorio";
    response.success = false;
    return response;
  }
  return response;
}

export function fixNullValueStructureForm(form: form) {
  let fixedContentForm = {
    ...form.content,
    formSubtitle:
      form.content.formSubtitle === "" ? "null" : form.content.formSubtitle,
    formNote: form.content.formNote === "" ? "null" : form.content.formNote,
    sections: form.content.sections.map((s) => ({
      ...s,
      sectionNote: s.sectionNote === "" ? "null" : s.sectionNote,
      fields: s.fields.map((f) => ({
        ...f,
        fieldNote: f.fieldNote === "" ? "null" : f.fieldNote,
      })),
    })),
  };

  fixedContentForm = {
    ...fixedContentForm,
    sections: fixedContentForm.sections.map((s) => ({
      ...s,
      fields: s.fields.map((f) => {
        if (f.fieldType === "text" || !f.options) return f;

        return {
          ...f,
          options: f.options.map((o) => ({
            ...o,
            optionNote: o.optionNote === "" ? "null" : o.optionNote,
          })),
        };
      }),
    })),
  };

  return fixedContentForm;
}
