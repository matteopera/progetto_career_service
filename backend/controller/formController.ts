import { MongoError } from "mongodb";
import {
  deleteFormById,
  findFormAsync,
  findFormsAsync,
  findLastFormsAsync,
  getDataCardAsync,
  insertNewForm,
  updateFormAsync,
  updateFormsToDraft,
} from "../db/formDb.js";
import { Request, Response } from "express";
import { DBError, handleDBError } from "../errors/DBError.js";
import { form } from "../types/form.js";
import {
  findLastRegisteredCompanies,
  findRegisteredCompanies,
  findRegisteredCompaniesByFormId,
} from "../db/companyDb.js";
import {
  checkStructureForm,
  fixNullValueStructureForm,
} from "../service/form.service.js";

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

export async function getLastFormsAsync(req: Request, res: Response) {
  try {
    const forms = await findLastFormsAsync();
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

export async function getCompiledFormsAsync(req: Request, res: Response) {
  try {
    const { idForm } = req.params;
    if (!idForm) {
      return res.status(400).json({ message: "Id form mancante" });
    }
    const compiledForms = await findRegisteredCompaniesByFormId(String(idForm));
    return res.status(200).json({ compiledForms });
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

export async function getLastCompiledFormsAsync(req: Request, res: Response) {
  try {
    const compiledForms = await findLastRegisteredCompanies();
    return res.status(200).json({ compiledForms });
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

    // Controllo validità della struttura del form
    const checkStructureRes = checkStructureForm(form);

    if (!checkStructureRes.success && checkStructureRes.message) {
      return res.status(400).json({ message: checkStructureRes.message });
    }

    // Form valido, mposto la string "null" dove non era presente niente
    const fixedContentForm = fixNullValueStructureForm(form);

    const finalForm: Omit<form, "_id"> = {
      created: new Date(),
      lastEdit: new Date(),
      note: form.note,
      title: form.title,
      status: form.status,
      content: {
        formNote: fixedContentForm.formNote,
        formTitle: fixedContentForm.formTitle,
        formSubtitle: fixedContentForm.formSubtitle,
        sections: fixedContentForm.sections,
      },
    };

    // Controllo lo status del nuovo form. Se online metto in bozza i restanti
    if (finalForm.status === "online") {
      const updated = await updateFormsToDraft();
      if (!updated) {
        finalForm.status = "draft";
      }
    }

    // Procedo con il salvataggio / aggiornamento del form
    let id;
    if (form._id) {
      id = await updateFormAsync(finalForm, form._id.toString());
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

export async function getDataDashboardAsync(req: Request, res: Response) {
  try {
    const resDb = await getDataCardAsync();

    return res.status(200).json(resDb);
  } catch (error) {
    console.log("Errore durante l'ottenimento delle statistiche", error);
    //codice in base all'errore del DB
    if (error instanceof MongoError) {
      const errorRes: DBError = handleDBError(error);
      return res.status(errorRes[0]).json({ message: errorRes[1] });
    }

    return res
      .status(500)
      .json({ message: "Impossibile ottenere le statistiche" });
  }
}
