import { MongoError } from "mongodb";
import {
  deleteFormById,
  findFormAsync,
  findFormsAsync,
  insertNewForm,
  updateForm,
} from "../db/form.js";
import { Request, Response } from "express";
import { DBError, handleDBError } from "../errors/DBError.js";
import { contentForm, form } from "../types/form.js";

export async function getFormsAsync(req: Request, res: Response) {
  try {
    const forms = await findFormsAsync();
    return res.status(200).json({ forms });
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

export async function getFormAsync(req: Request, res: Response) {
  try {
    const { idForm } = req.params;
    console.log(req.params);
    if (!idForm) {
      return res.status(400).json({ message: "Id form mancante" });
    }
    const form = await findFormAsync(idForm.toString());
    return res.status(200).json({ form });
  } catch (error) {
    console.log("Errore durante il recupero dei form", error);
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    return res.status(500).json({ message: "Impossibile recuperare il form" });
  }
}

export async function deleteFormAsync(req: Request, res: Response) {
  try {
    const { idForm } = req.body;

    if (!idForm) {
      return res.status(400).json({ message: "Id form mancante" });
    }
    const deleteRes = await deleteFormById(idForm.toString());

    if (deleteRes === 0) {
      return res
        .status(500)
        .json({ message: "Errore durante eliminazione del form" });
    }
    return res
      .status(200)
      .json({ message: "Il form è stato eliminato con successo" });
  } catch (error) {
    console.log("Errore durante il recupero dei form", error);
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    return res.status(500).json({ message: "Impossibile eliminare il form" });
  }
}

export async function saveFormAsync(req: Request, res: Response) {
  try {
    // Controllo dati form obbligatori se presenti
    const { form }: { form: form } = req.body;

    if (form.title === "")
      return res.status(400).json("Il titolo del form interno è obbligatorio");
    if (
      form.content.sections.length == 0 ||
      form.content.sections.some((s) => s.fields.length == 0)
    ) {
      // Controllo dati base del form se sono OK
      return res
        .status(400)
        .json(
          "Creare almeno una sezione e un campo. Ogni sezione deve avere almeno un campo",
        );
    }
    if (form.content.sections.some((s) => s.sectionTitle === "")) {
      return res
        .status(400)
        .json("Le sezioni devono avere un titolo obbligatorio");
    }
    if (
      form.content.sections
        .flatMap((s) => s.fields)
        .some((f) => f.fieldTitle === "")
    ) {
      return res
        .status(400)
        .json("I campi devono avere un titolo obbligatorio");
    }
    if (
      form.content.sections
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
    let checkedContentForm = { ...form.content };
    checkedContentForm = {
      ...checkedContentForm,
      formSubtitle:
        checkedContentForm.formSubtitle === ""
          ? "null"
          : checkedContentForm.formSubtitle,
      formNote:
        checkedContentForm.formNote === ""
          ? "null"
          : checkedContentForm.formNote,
    };
    // Fix note
    checkedContentForm = {
      ...checkedContentForm,
      sections: checkedContentForm.sections.map((s) => ({
        ...s,
        sectionNote: s.sectionNote === "" ? "null" : s.sectionNote,
      })),
    };

    checkedContentForm = {
      ...checkedContentForm,
      sections: checkedContentForm.sections.map((s) => ({
        ...s,
        fields: s.fields.map((f) => ({
          ...f,
          fieldNote: f.fieldNote === "" ? "null" : f.fieldNote,
        })),
      })),
    };

    checkedContentForm = {
      ...checkedContentForm,
      sections: checkedContentForm.sections.map((s) => ({
        ...s,
        fields: s.fields.map((f) => {
          if (f.fieldType === "text") return f;

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

    const finalForm: Omit<form, "_id"> = {
      created: new Date(),
      lastEdit: new Date(),
      note: form.note,
      title: form.title,
      status: form.status,
      content: {
        formNote: checkedContentForm.formNote,
        formTitle: checkedContentForm.formTitle,
        formSubtitle: checkedContentForm.formSubtitle,
        sections: checkedContentForm.sections,
      },
    };

    // Procedo con il salvataggio / aggiornamento del form

    let id;
    if (form._id) {
      id = await updateForm(finalForm, form._id);
    } else {
      id = await insertNewForm(finalForm);
    }

    if (id === 0) {
      return res
        .status(500)
        .json({ message: "Errore durante inserimento/aggiornamento del form" });
    }
    return res
      .status(200)
      .json({ message: "Il form è stato inserito/aggiornato con successo" });
  } catch (error) {
    console.log("Errore durante il inserimento/aggiornamento del form", error);
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    return res.status(500).json({ message: "Impossibile salvare il form" });
  }
}
