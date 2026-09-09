import { MongoError } from "mongodb";
import { findFormsAsync, insertNewForm } from "../db/form.js";
import { Request, Response } from "express";
import { DBError, handleDBError } from "../errors/DBError.js";
import { contentForm } from "../types/form.js";

export async function getFormsAsync(req: Request, res: Response) {
  try {
    const forms = await findFormsAsync();
    return res.status(200).json(forms);
  } catch (error) {
    console.log("Errore durante il recupero dei form", error);
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    return res.status(500).json({ message: "Impossibile recuperare i form" });
  }
}

export async function saveFormsAsync(req: Request, res: Response) {
  try {
    // Controllo dati form obbligatori se presenti
    const { form }: { form: contentForm } = req.body;
    if (
      form.sections.length == 0 ||
      form.sections.some((s) => s.fields.length == 0)
    ) {
      // TODO: status
      return res
        .status(400)
        .json(
          "Creare almeno una sezione e un campo. Ogni sezione deve avere almeno un campo",
        );
    }
    if (form.sections.some((s) => s.sectionTitle === "")) {
      return res
        .status(400)
        .json("Le sezioni devono avere un titolo obbligatorio");
    }
    if (
      form.sections.flatMap((s) => s.fields).some((f) => f.fieldTitle === "")
    ) {
      return res
        .status(400)
        .json("I campi devono avere un titolo obbligatorio");
    }
    if (
      form.sections
        .flatMap((s) => s.fields)
        .filter((f) => f.fieldType === "check" || f.fieldType === "radio")
        .flatMap((f) => f.options)
        .some((o) => o.optionName === "")
    ) {
      return res
        .status(400)
        .json(
          "Le opzioni dei campi radio o checkbox devono avere un titolo obbligatorio",
        );
    }

    // Imposto la string "null" dove non era presente niente
    let finalForm = { ...form };
    finalForm = {
      ...finalForm,
      formSubtitle:
        finalForm.formSubtitle === "" ? "null" : finalForm.formSubtitle,
    };
    // Fix note
    finalForm = {
      ...finalForm,
      sections: finalForm.sections.map((s) => ({
        ...s,
        sectionNote: s.sectionNote === "" ? "null" : s.sectionNote,
      })),
    };

    finalForm = {
      ...finalForm,
      sections: finalForm.sections.map((s) => ({
        ...s,
        fields: s.fields.map((f) => ({
          ...f,
          fieldNote: f.fieldNote === "" ? "null" : f.fieldNote,
        })),
      })),
    };

    finalForm = {
      ...finalForm,
      sections: finalForm.sections.map((s) => ({
        ...s,
        fields: s.fields.map((f) => {
          if (f.fieldType === "text") return f;

          return {
            ...f,
            options: f.options.map((o) => ({
              ...o,
              optionNote: o.optionNote === "" ? "null" : "",
            })),
          };
        }),
      })),
    };

    // Procedo con il salvataggio del form
    const id = await insertNewForm(finalForm);
    if (!id) {
      return res.status(500).json("Errore durante inserimento del form");
    }
    return res
      .status(200)
      .json({ message: "Il form è stato inserito con successo" });
  } catch (error) {
    console.log("Errore durante il recupero dei form", error);
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    return res.status(500).json({ message: "Impossibile salvare il form" });
  }
}
